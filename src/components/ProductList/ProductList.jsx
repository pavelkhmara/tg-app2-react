import React, { useEffect, useCallback } from 'react';
import './ProductList.css';
import ProductItem from '../ProductItem/ProductItem';
import { useTelegram } from '../../hooks/useTelegram';
require('dotenv').config();

const products = [
  {id: '1', title: 'Juice', price: 200, description: 'Fresh juice 1l'},
  {id: '2', title: 'Cola', price: 150, description: 'Coca-Cola 0.5l'},
  {id: '3', title: 'Water', price: 100, description: 'Pure water 0.5l'},
  {id: '4', title: 'Fanta', price: 170, description: 'Fanta 0.5l'},
    {id: '5', title: 'Jaket', price: 1200, description: 'Winter jaket'},
    {id: '6', title: 'Socks', price: 300, description: 'Warm socks'},
    {id: '7', title: 'Hat', price: 250, description: 'Winter hat'},
    {id: '8', title: 'Boots', price: 3500, description: 'Winter boots'},
    {id: '9', title: 'Gloves', price: 400, description: 'Warm gloves'},
    {id: '10', title: 'Scarf', price: 350, description: 'Wool scarf'},
];

const getTotalPrice = (items) => {
    return items.reduce((acc, item) => {
        return acc += item.price;
    }, 0);
}

const ip = process.env.IP_ADDRESS,
      port = process.env.PORT;

const ProductList = () => {
    const [ addedItems, setAddedItems ] = React.useState([]);
    const { tg, queryId } = useTelegram();

    const onSendData = useCallback( () => {
            const data = { 
                products: addedItems, 
                totalPrice: getTotalPrice(addedItems),
                queryId
            };
            fetch('http://' + ip + ':' + port + '/web-data' || 'http://localhost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
        }, [addedItems, queryId, tg]);
    
        useEffect(() => {
            tg.onEvent('mainButtonClicked', onSendData);
            return () => {
                tg.offEvent('mainButtonClicked', onSendData);
            }
        }, [onSendData]);

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];

        if(alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems);

        if(newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.setParams({
                text: `Buy ${getTotalPrice(newItems)} items`
            });
            tg.MainButton.show();
        }
    }

    // React.useEffect(() => {
    //     setAddedItems(product);
    // }, [product]);

    return (
        <div className={'list'}>
            {products.map(item => (
                <ProductItem
                    product={item}
                    onAdd={onAdd}
                    className={'item'}
                    key={item.id}
                />
            ))}
          
        </div>
    );
};

export default ProductList;