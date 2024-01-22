// index.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "../styles/firebase";
import styles from "../styles/index.module.scss";

// ホームページコンポーネント
const Home = () => {
  // 各フロアの状態を管理するステート
  const [floorsStatus, setFloorsStatus] = useState<
    Record<
      string,
      {
        [key: string]: {
          status: string;
          buttonColor: string;
          category: string;
        };
      }
    >
  >({});

  // 利用する建物とフロアのリスト
  const floors = ["5F", "2F", "3F", "4F", "1F"];
  const buildings = ["2号館", "3号館"]; // この行を追加

  // フロアを数値でソート
  floors.sort((a, b) => {
    const numA = parseInt(a.slice(0, -1), 10);
    const numB = parseInt(b.slice(0, -1), 10);
    return numB - numA;
  });

  // ルーターのインスタンス
  const router = useRouter();

  // ページロード時にデータを取得する副作用フック
  useEffect(() => {
    const fetchData = async () => {
      // 初期化する建物のリスト
      const buildings = ["2号館", "3号館"];

      // 初期の状態を生成
      const initialStatus: Record<
        string,
        {
          [key: string]: {
            status: string;
            buttonColor: string;
            category: string;
          };
        }
      > = {};
      buildings.forEach((building) => {
        initialStatus[building] = {};
        floors.forEach((floor) => {
          initialStatus[building][floor] = {
            status: "",
            buttonColor: "",
            category: "",
          };
        });
      });
      setFloorsStatus(initialStatus);

      // Firestoreの更新を監視するコールバック関数を格納する配列
      const unsubscribeCallbacks: (() => void)[] = [];

      // 各建物とフロアに対してFirestoreの更新を監視
      buildings.forEach((building) => {
        floors.forEach((floor) => {
          const docRef = doc(firestore, "statuses", building, "floors", floor);
          const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
              const data = docSnapshot.data();
              const statusData = {
                status: data?.status || "",
                buttonColor: getButtonColor(data?.status || ""),
                category: data?.category || "",
              };

              // ステートを更新
              setFloorsStatus((prevStatus) => ({
                ...prevStatus,
                [building]: {
                  ...prevStatus[building],
                  [floor]: statusData,
                },
              }));
            }
          });
          unsubscribeCallbacks.push(unsubscribe);
        });
      });

      // コンポーネントがアンマウントされたときにFirestoreの更新監視を解除する
      return () => {
        unsubscribeCallbacks.forEach((unsubscribe) => unsubscribe());
      };
    };

    fetchData();
  }, []);

  // フロアボタンがクリックされたときのハンドラ
  const clickHandler = (building: string, floor: string) => {
    router.push(`/detail?building=${building}&floor=${floor}`);
  };

  // ステータスに対応するボタンの色を取得する関数
  const getButtonColor = (status: string) => {
    switch (status) {
      case "利用停止":
        return "monitor-no-use";
      case "混雑":
        return "monitor-crowded";
      case "やや混雑":
        return "monitor-little-crowded";
      case "空き":
        return "monitor-empty";
      default:
        return "";
    }
  };

  // レンダリング
  return (
    <>
      {/* ヘッドにフォントスタイルのリンクを追加 */}
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></meta>
      </Head>
      {/* メインタイトル */}
      <h1 className="main_title">混雑状況</h1>
      <div className={styles.wrap}>
        <div className={styles.listBox}>
          {/* 建物のリストをソートして表示 */}
          {buildings.sort().map((building: string) => (
            <div key={building}>
              <h2 className="floa-number">{building}</h2>
              <ul className={styles.list}>
                {/* フロアのリストを表示 */}
                {floors.map((floor) => {
                  const isStatusUndefined =
                    floorsStatus[building]?.[floor]?.status === "未定義";
                  return (
                    <li key={floor}>
                      {isStatusUndefined ? (
                        <div style={{ visibility: "hidden" }} />
                      ) : (
                        <button
                          className={`monitor ${
                            floorsStatus[building]?.[floor]?.buttonColor || ""
                          }`}
                          onClick={() => clickHandler(building, floor)}
                        >
                          {floor}・
                          {floorsStatus[building]?.[floor]?.category && (
                            <span className="category">
                              {floorsStatus[building][floor]?.category}
                            </span>
                          )}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
// コンポーネントをエクスポート
export default Home;
