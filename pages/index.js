import axios from 'axios';

import Featured from '../components/Featured';
import PizzaList from '../components/PizzaList';
import styles from '../styles/Home.module.css';

export default function Home({ pizzasListData }) {
  return (
    <div className={styles.container}>
      <Featured />
      <PizzaList pizzasListData={pizzasListData} />
    </div>
  );
}

export const getServerSideProps = async () => {
  const res = await axios.get(`${process.env.BASE_URL}/api/products`);
  return {
    props: {
      pizzasListData: res.data,
    },
  };
};
