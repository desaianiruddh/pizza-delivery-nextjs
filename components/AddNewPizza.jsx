import { useState } from 'react';
import axios from 'axios';

import styles from '../styles/AddPizza.module.css';

const AddNewPizza = ({ setClose }) => {
  const [fileUrl, setFileUrl] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [prices, setPrices] = useState([]);
  const [extraOptions, setExtraOptions] = useState([]);
  const [extra, setExtra] = useState('');
  const changePrice = (e, index) => {
    const currentPrices = prices;
    currentPrices[index] = e.target.value;
    setPrices(currentPrices);
  };
  const handleExtraInput = (e) => {
    const { name, value } = e.target;
    setExtra({ ...extra, [name]: value });
  };
  const handleAddExtra = (e) => {
    setExtraOptions((prev) => [...prev, extra]);
  };
  const addNewPizaa = async () => {
    if (fileUrl !== '' && title !== '' && desc !== '' && prices.length === 3) {
      try {
        const newProduct = {
          title,
          desc,
          prices,
          extraOptions,
          img: fileUrl,
        };
        await axios.post(`${process.env.BASE_URL}/api/products`, newProduct);
        setClose(true);
      } catch (err) {
        console.log(err);
      }
    } else {
      alert('Must add Image URL, Title, Description, Prices');
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <span onClick={() => setClose(true)} className={styles.close}>
          X
        </span>
        <h1>Add new Pizza</h1>
        <div className={styles.item}>
          <label className={styles.label}>Image URL</label>
          <input
            type="text"
            className={styles.input}
            onChange={(e) => setFileUrl(e.target.value)}
          />
        </div>
        <div className={styles.item}>
          <label className={styles.label}>Title</label>
          <input
            className={styles.input}
            type="text"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={styles.item}>
          <label className={styles.label}>Description</label>
          <textarea
            rows={4}
            type="text"
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <div className={styles.item}>
          <label className={styles.label}>Prices</label>
          <div className={styles.priceContainer}>
            <input
              className={`${styles.input} ${styles.inputSm}`}
              type="number"
              placeholder="Small"
              onChange={(e) => changePrice(e, 0)}
            />
            <input
              className={`${styles.input} ${styles.inputSm}`}
              type="number"
              placeholder="Medium"
              onChange={(e) => changePrice(e, 1)}
            />
            <input
              className={`${styles.input} ${styles.inputSm}`}
              type="number"
              placeholder="Large"
              onChange={(e) => changePrice(e, 2)}
            />
          </div>
        </div>
        <div className={styles.item}>
          <label className={styles.label}>Extra Ingredients</label>
          <div className={styles.extra}>
            <input
              className={`${styles.input} ${styles.inputSm}`}
              type="text"
              placeholder="Item"
              name="text"
              onChange={handleExtraInput}
            />
            <input
              className={`${styles.input} ${styles.inputSm}`}
              type="number"
              placeholder="Price"
              name="price"
              onChange={handleExtraInput}
            />
            <button className={styles.addButton} onClick={handleAddExtra}>
              Add Item
            </button>
          </div>
          <div className={styles.extraItems}>
            {extraOptions.map((option) => (
              <span key={option.text} className={styles.extraItem}>
                {option.text}
              </span>
            ))}
          </div>
        </div>
        <button className={styles.addButton} onClick={addNewPizaa}>
          Add Pizza
        </button>
      </div>
    </div>
  );
};

export default AddNewPizza;
