// detail.tsx
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';

const Detail = () => {
  const router = useRouter();
  const { building, floor } = router.query;

  return (
    <>
      <Head>
        <title>混雑情報 - {building} {floor}</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" />
      </Head>
      <div className="container">
        <h1 className="main_title">混雑情報</h1>
        <div className="building-floor">
          <span>{building} </span>
          <span>{floor}</span>
        </div>
        <div className="image-container">
          <Image src="/images/crds_person.jpg" alt="Floor Image" width={600} height={400} />
        </div>
        <p>かなり混雑しています。</p>
        <footer>
          © 2023 ECC Co.,Ltd. All Rights Reserved.
        </footer>
      </div>
      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
        }
        .main_title {
          margin-top: 20px;
        }
        .building-floor {
          font-size: 24px;
          margin: 20px 0;
        }
        .image-container {
          margin: 20px 0;
        }
        footer {
          margin-top: 20px;
          font-size: 12px;
        }
      `}</style>
    </>
  );
};

export default Detail;