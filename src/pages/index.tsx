// index.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '../styles/firebase'; 
import styles from '../styles/Home.module.css';


const Home = () => {
  const [floorsStatus, setFloorsStatus] = useState<Record<string, { [key: string]: { status: string; buttonColor: string; } }>>({});
   // 各フロアのリスト。新しいフロアはこちらに追加する。
  const floors = ['5F', '2F', '3F', '4F', '1F'];
    // フロア番号の降順でソートします。
    floors.sort((a, b) => {
      const numA = parseInt(a.slice(0, -1), 10);
      const numB = parseInt(b.slice(0, -1), 10);
      return numB - numA;
    });

  const router = useRouter();

  useEffect(() => {
      // Firestoreから各フロアの状態を取得する関数
    const fetchData = async () => {
      // 取得対象のリスト
      const buildings = ['2号館', '3号館'];

      // 初期状態の設定
      const initialStatus: Record<string, { [key: string]: { status: string; buttonColor: string; } }> = {};

      buildings.forEach((building) => {
        initialStatus[building] = {};
        floors.forEach((floor) => {
          initialStatus[building][floor] = { status: '', buttonColor: '' };
        });
      });

      setFloorsStatus(initialStatus);

      // フロアの状態をFirestoreから取得
      buildings.forEach((building) => {
        floors.forEach((floor) => {
          const docRef = doc(firestore, 'statuses', building, 'floors', floor);
          const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
              // Firestoreのデータを取得し、ステートを更新
              const data = docSnapshot.data();
              const statusData = {
                status: data?.status || '',
                buttonColor: getButtonColor(data?.status || ''),
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
          return unsubscribe; // クリーンアップ関数を返す
        });
      });
    };

    fetchData();
  }, []); // 空の依存リストを渡して一度だけ実行

  // フロアがクリックされた時の処理
  const clickHandler = (building: string, floor: string) => {
    router.push(`/detail?building=${building}&floor=${floor}`);
  };
  // ステータスに応じたボタンの色を返すユーティリティ関数
  const getButtonColor = (status: string) => {
    switch (status) {
      case '利用停止':
        return 'monitor-no-use';
      case '混雑':
        return 'monitor-crowded';
      case 'やや混雑':
        return 'monitor-little-crowded';
      case '空き':
        return 'monitor-empty';
      default:
        return '';
    }
  };

  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" />
      </Head>
      <h1 className={styles.main_title}>混雑状況</h1>
      <table className={styles.floa_table}>
        <thead>
          <tr className='place-number'>
            {Object.keys(floorsStatus).map((building) => (
              <th key={building} className='floa-number'>{building}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {floors.map((floor) => (
            <tr key={floor}>
              {Object.keys(floorsStatus).map((building) => (
                <td key={building}>
                  <button
                    className={`monitor ${floorsStatus[building][floor]?.buttonColor || ''}`}
                    onClick={() => clickHandler(building, floor)}
                  >
                    {floor} 
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Home;
