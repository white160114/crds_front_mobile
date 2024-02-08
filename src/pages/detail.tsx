import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';

const Detail = () => {
  const router = useRouter();
  const { building, floor, status } = router.query;

  // 戻るボタンがクリックされたときのハンドラ
  const handleBackButtonClick = () => {
    router.back(); // 前のページに遷移
  };

  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" />
      </Head>
      <div className="container">
        <h1 className="main_title">混雑情報</h1>
        <div className="building-floor">
          <span>{building} </span>
          <span>{floor}</span>
        </div>
        <div className="image-container">
          {/* <Image src="/images/crds_person.jpg" alt="Floor Image" width={550} height={450} /> */}
          <Image src="http://10.200.3.88:8000/req/img/3_2F" alt="Floor Image" width={550} height={450} />
        </div>
        <p>{status}</p>
        <div>
          <button className='return-button' onClick={handleBackButtonClick}>
            戻る
          </button>
        </div>
        <footer>
          © 2023 ECC Co.,Ltd. All Rights Reserved.
        </footer>
      </div>
    </>
  );
};

export default Detail;
