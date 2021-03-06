import type { NextPage } from "next";
import Head from "next/head";
import Background from "../components/Home/Background";
import Hero from "../components/Home/Hero";
import styles from "../styles/Home.module.scss";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Background />
        <Hero />
      </main>

      <footer className={styles.footer}>footer</footer>
    </div>
  );
};

export default Home;
