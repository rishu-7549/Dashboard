import { useEffect, useRef } from "react";
import {
  doc,
  onSnapshot,
  updateDoc,
  setDoc,
  serverTimestamp,
  collection,
  addDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  query,
  where,
  getDocs,
  deleteDoc as firestoreDeleteDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useDashboard } from "../context/DashboardContext";
import { useAuth } from "../context/AuthContext";

export default function useFirebaseSync(dashboardId) {
  const { state, dispatch } = useDashboard();
  const { user } = useAuth();
  const lastUpdateRef = useRef(null);
  const isInitializedRef = useRef(false);
  const userId = useRef(
    user?.uid || `user-${Math.random().toString(36).substr(2, 9)}`
  );
  const presenceRef = useRef(null);
  const pendingLocalChangesRef = useRef(new Set());
  const lastLocalUpdateRef = useRef(null);

  useEffect(() => {
    if (user?.uid) {
      userId.current = user.uid;
    }
  }, [user]);

  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      if (pendingLocalChangesRef.current.size > 10) {
        console.log("Cleaning up local changes tracking");
        pendingLocalChangesRef.current.clear();
      }
    }, 60000);

    return () => clearInterval(cleanupInterval);
  }, []);

  useEffect(() => {
    const cleanupStalePresence = async () => {
      try {
        const presenceCollectionRef = collection(
          db,
          "dashboards",
          dashboardId,
          "presence"
        );
        const allPresenceQuery = query(presenceCollectionRef);
        const snapshot = await getDocs(allPresenceQuery);

        const now = Date.now();
        const staleThreshold = 5 * 60 * 1000;

        snapshot.docs.forEach(async (docSnapshot) => {
          const data = docSnapshot.data();
          const lastSeen = data.lastSeen?.toDate?.() || new Date(0);
          const timeDiff = now - lastSeen.getTime();
          if (timeDiff > staleThreshold) {
            console.log(`Removing stale presence entry: ${data.userId}`);
            await firestoreDeleteDoc(docSnapshot.ref);
          }
        });
      } catch (error) {
        console.error("Error cleaning up stale presence:", error);
      }
    };
    const cleanupInterval = setInterval(cleanupStalePresence, 120000);

    return () => clearInterval(cleanupInterval);
  }, [dashboardId]);
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log("Page is unloading, cleaning up user presence");
      const presenceRef = doc(
        db,
        "dashboards",
        dashboardId,
        "presence",
        userId.current
      );
      setDoc(
        presenceRef,
        {
          userId: userId.current,
          lastSeen: serverTimestamp(),
          isOnline: false,
        },
        { merge: true }
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handleBeforeUnload);
    };
  }, [dashboardId]);
  useEffect(() => {
    if (!user) return;

    console.log("🔥 Initializing Firebase sync for user dashboard:", {
      dashboardId,
      userId: userId.current,
      userEmail: user.email,
    });
    const ref = doc(db, "dashboards", dashboardId);
    const unsub = onSnapshot(ref, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        console.log("📥 Received dashboard data from Firestore:", {
          widgetsCount: data.widgets?.length || 0,
          theme: data.theme,
          lastModifiedBy: data.lastModifiedBy,
          userEmail: data.userEmail,
        });
        const isOurUpdate = data.lastModifiedBy === userId.current;
        const isRecentLocalUpdate =
          lastLocalUpdateRef.current &&
          Date.now() - lastLocalUpdateRef.current < 2000;

        if (isOurUpdate && isRecentLocalUpdate) {
          console.log("🔄 Ignoring our own recent update");
          return;
        }
        const currentWidgets = JSON.stringify(state.widgets);
        const newWidgets = JSON.stringify(data.widgets || []);

        if (currentWidgets !== newWidgets) {
          console.log("🔄 Applying remote changes to local state");
          dispatch({ type: "SET_WIDGETS", payload: data.widgets || [] });
        }

        if (data.theme && data.theme !== state.theme) {
          dispatch({ type: "SET_THEME", payload: data.theme });
        }
        if (!isInitializedRef.current) {
          console.log(
            "✅ Dashboard loaded from Firestore, marking as initialized"
          );
          isInitializedRef.current = true;
          dispatch({ type: "SET_LOADING", payload: false });
        }
      } else {
        console.log(
          "📄 Dashboard document doesn't exist yet, creating new one"
        );
        setDoc(
          ref,
          {
            widgets: [],
            theme: "light",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            lastModifiedBy: userId.current,
            userId: userId.current,
            userEmail: user.email,
          },
          { merge: true }
        )
          .then(() => {
            console.log(
              "✅ New dashboard document created in Firestore for user:",
              user.email
            );
            isInitializedRef.current = true;
            dispatch({ type: "SET_LOADING", payload: false });
          })
          .catch((error) => {
            console.error("❌ Error creating dashboard document:", error);
            dispatch({ type: "SET_LOADING", payload: false });
          });
      }
    });
    const presenceRef = doc(
      db,
      "dashboards",
      dashboardId,
      "presence",
      userId.current
    );
    setDoc(
      presenceRef,
      {
        userId: userId.current,
        lastSeen: serverTimestamp(),
        isOnline: true,
      },
      { merge: true }
    );
    const presenceCollectionRef = collection(
      db,
      "dashboards",
      dashboardId,
      "presence"
    );
    const presenceQuery = query(
      presenceCollectionRef,
      where("isOnline", "==", true)
    );

    const presenceUnsub = onSnapshot(presenceQuery, (snapshot) => {
      const onlineUsers = snapshot.docs.map((doc) => doc.data().userId);
      console.log("👥 Online users from presence:", onlineUsers);
      const uniqueUsers = [...new Set(onlineUsers)];
      console.log("👥 Unique active users:", uniqueUsers);
      dispatch({ type: "SET_ACTIVE_USERS", payload: uniqueUsers });
    });

    return () => {
      unsub();
      presenceUnsub();
      if (presenceRef) {
        setDoc(
          presenceRef,
          {
            userId: userId.current,
            lastSeen: serverTimestamp(),
            isOnline: false,
          },
          { merge: true }
        );
      }
    };
  }, [dashboardId, user]);

  useEffect(() => {
    if (!isInitializedRef.current || !user) return;

    const timeoutId = setTimeout(() => {
      const ref = doc(db, "dashboards", dashboardId);
      const updateData = {
        widgets: state.widgets,
        theme: state.theme,
        updatedAt: serverTimestamp(),
        lastModifiedBy: userId.current,
      };
      const updateString = JSON.stringify(updateData);
      if (lastUpdateRef.current === updateString) {
        return;
      }

      lastUpdateRef.current = updateString;
      lastLocalUpdateRef.current = Date.now();

      console.log("Sending local changes to Firestore:", {
        dashboardId,
        widgets: state.widgets.length,
        theme: state.theme,
        modifiedBy: userId.current,
        userEmail: user.email,
      });

      setDoc(ref, updateData, { merge: true })
        .then(() => {
          console.log(
            "Successfully saved dashboard to Firestore for user:",
            user.email
          );
        })
        .catch((error) => {
          console.error("Error saving dashboard to Firestore:", error);
        });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [state.widgets, state.theme, dashboardId, user]);

  useEffect(() => {
    if (!user) return;

    const presenceInterval = setInterval(() => {
      if (isInitializedRef.current) {
        const presenceRef = doc(
          db,
          "dashboards",
          dashboardId,
          "presence",
          userId.current
        );
        setDoc(
          presenceRef,
          {
            userId: userId.current,
            lastSeen: serverTimestamp(),
            isOnline: true,
          },
          { merge: true }
        );
      }
    }, 30000);

    return () => clearInterval(presenceInterval);
  }, [dashboardId, user]);
}
