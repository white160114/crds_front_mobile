import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "../styles/firebase";

const Home = () => {
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // 画像のインデックスを管理
  const floors = ["6F", "5F", "4F", "3F", "2F", "1F"];
  const baseImageUrl = "https://click.ecc.ac.jp/ecc/shinyat/eten_img/img/";
  const baseProductName =
    "https://click.ecc.ac.jp/ecc/y_arikawa/congestion/images/products/";
  const baseProductAbout =
    "https://click.ecc.ac.jp/ecc/y_arikawa/congestion/images/products/";
  const productIds = [
    "I26-104",
    "I25-014",
    "I26-105",
    "I26-001",
    "I26-011",
    "I26-204",
    "I26-137",
    "I25-012",
    "I24-006",
    "I25-203",
  ]; // ここに商品のIDを追加
  const productAboutIds = [
    "i26_104",
    "i25_014",
    "i26_105",
    "i26_001",
    "i26_011",
    "i26_204",
    "i26_137",
    "i25_012",
    "i24_006",
    "i25_203",
  ];
  const urls = productIds.map((productId, index) => ({
    image: baseImageUrl + productIds[index] + "_0.jpg",
    number: baseProductName + productAboutIds[index] + "_L.jpg",
    text: baseProductAbout + productAboutIds[index] + "_R.jpg",
  })); // 画像のURLを配列に追加
  const intervalDuration = 5000; // インターバルの時間を定義

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const buildings = ["2号館"];

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

      const unsubscribeCallbacks: (() => void)[] = [];

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

      return () => {
        unsubscribeCallbacks.forEach((unsubscribe) => unsubscribe());
      };
    };

    fetchData();

    // 画像の切り替え用のインターバル設定
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % urls.length);
    }, intervalDuration);

    return () => clearInterval(intervalId); // コンポーネントがアンマウントされるときにインターバルをクリアする
  }, [urls.length]); // urls.length を依存リストに追加

  const clickHandler = (building: string, floor: string) => {
    router.push(`/detail?building=${building}&floor=${floor}`);
  };

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

  function getStatus(status: string) {
    switch (status) {
      case "空き":
        return (
          <img
            className="img-icon"
            src="/maru-removebg-preview.png"
            alt="空き"
          />
        );
      case "混雑":
        return (
          <img
            className="img-icon"
            src="/batu-removebg-preview.png"
            alt="混雑"
          />
        );
      case "やや混雑":
        return (
          <img
            className="img-icon"
            src="/sankaku-removebg-preview.png"
            alt="やや混雑"
          />
        );
      default:
        return null;
    }
  }

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap"
        />
      </Head>
      <img src="/logo_icon.png" alt="aaa" className="title-image" />
      {/* カラーボックスと説明を表示する部分 */}
      <div className="color-explanation">
        <p className="situation">混雑状況</p>

        <div className="color-box">
          <div className="small-color-box small-color-box-crowded" />
        </div>
        <div className="color-explanation-item">混雑</div>

        <div className="color-box">
          <div className="small-color-box small-color-box-little-crowded" />
        </div>
        <div className="color-explanation-item">やや混雑</div>

        <div className="color-box">
          <div className="small-color-box small-color-box-empty" />
        </div>
        <div className="color-explanation-item">空き</div>
      </div>

      <div className="list-with-image">
        <div className="floor-table-container">
          <table className="floa-table">
            <thead>
              <tr className="place-number">
                {Object.keys(floorsStatus).map((building) => (
                  <th key={building} className="floa-number">
                    {building}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {floors.map((floor) => (
                <tr key={floor}>
                  {Object.keys(floorsStatus).map((building) => {
                    const isStatusUndefined =
                      floorsStatus[building][floor]?.status === "未定義";

                    return (
                      <td key={building}>
                        {isStatusUndefined ? (
                          <div style={{ visibility: "hidden" }} />
                        ) : (
                          <button
                            className={`monitor ${
                              floorsStatus[building][floor]?.buttonColor || ""
                            }`}
                            onClick={() => clickHandler(building, floor)}
                          >
                            <span className="floor-text">{floor}</span>
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Home;
