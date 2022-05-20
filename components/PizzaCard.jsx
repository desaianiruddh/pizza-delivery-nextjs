import Image from 'next/image';
import Link from 'next/link';

import styles from '../styles/PizzaCard.module.css';

const PizzaCard = ({ pizzaInfo }) => {
  const { _id,title, prices, img, desc } = pizzaInfo;
  return (
    <div className={styles.container}>
      <Link href={`/product/${_id}`} passHref>
        <Image
          src={img}
          alt="pizza"
          width="500"
          height="500"
          className={styles.pizzaImg}
        />
      </Link>
      <h1 className={styles.title}>{title}</h1>
      <span className={styles.price}>Rs.{prices[1]}/-</span>
      <p className={styles.desc}>{desc}</p>
    </div>
  );
};

export default PizzaCard;
