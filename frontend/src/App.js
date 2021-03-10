import { useEffect, useState } from "react";
import Card from './Components/card';

function App() {

  const [products, setProducts ] = useState([]);
  const [isLoading, setisLoading ] = useState(true);

  useEffect( () => {
    fetch('http://localhost:4000/')
      .then( response => response.json() )
      .then( products => {
        console.log(products);
        setProducts(products);
        setisLoading(false);
      })
  },[])

  if(isLoading) return <div> isLaoding ...</div>;

  return (
    <div className="App">
      <div className="grid grid-cols-3 gap-4">
        {
          products.map( product => { return <Card key={product.id} product={product}/>})
        }
      </div>
    </div>
  );
}

export default App;
