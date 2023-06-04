import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Text,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState, useCallback, useMemo, useEffect } from "react";
import axios from "axios";
import { trophyImage } from "../assets";
import "../assets/css/style.css";
import { useNavigate } from "react-router-dom";
import { ProductsCard } from "../components";
import { SubProductList } from "../components/SubProductList";


export default function HomePage() {
  const [values, setValues] = useState({
    product_id: '',
    productname: '',
    subproductname: '',
    addprice: ''
  })

  const navigate = useNavigate();
  var prodid;

  function chkind(){
    var dropdown1 = document.getElementById('product');
    prodid = dropdown1.options[dropdown1.selectedIndex].value;
    var prodname = dropdown1.options[dropdown1.selectedIndex].text;
    var textid = document.getElementById('product_id');
    var textname = document.getElementById('productname');
      textid.value = prodid;
      textname.value = prodname;  
      setValues({ ...values, ['product_id']: [prodid],['productname']: [prodname] })
      // setValues({ ...values, ['productname']: [prodname] })
    }

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: [event.target.value] })
  }
  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   // console.log(values);
  //   axios.post('http://localhost:8081/varientdb', values)
  //     .then(res => {
  //       resetform();
  //     })
  //     .catch(err => console.log(err));
  // }

  // https://admin.shopify.com/store/amitstoreapp-dev/apps/product-api
  // 'https://73112506874f67c0b052e8ac5f8c9e1a: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@amitstoreapp-dev.myshopify.com/admin/api/2021-10/products.json'

  const options = {
    mode: 'no-cors',
    headers: {
      'Content-type': 'application/json', 
    },
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(values);

    axios.post(
      'https://886acca7009108b760da6658a74b3331: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@amitstoreapp-dev.myshopify.com/admin/api/2021-10/products/'+prodid+'/variants.json',
      {query: `
          query {     
            products(first:10) {         
              edges {             
                node {                 
                  id                 
                  handle                 
                  metafields(first:10){                     
                    edges {                         
                      node {                             
                        key                             
                        value                         
                      }                     
                    }                 
                  }             
                }         
              }     
            }
          }
      `},
      {headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8;application/json'}}
    ).then(res => {
      resetform();
    })
    .catch(err => console.log(err));


    // axios.post('https://886acca7009108b760da6658a74b3331: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@amitstoreapp-dev.myshopify.com/admin/api/2021-10/products/'+prodid+'/variants.json',
    // values)
    //   .then(res => {
    //     resetform();
    //   })
    //   .catch(err => console.log(err));
  }


  const handlePopulate = async () =>{
    // const response = await fetch("/api/variants/create");
    // const variant = new shopify.api.rest.Variant({session: session});
    // variant.product_id = 632910392;
    // variant.option1 = "Yellow";
    // variant.price = "1.00";
    // await variant.save({
    //   update: true,
    // });
  }
 

  function resetform() {
    const form = document.getElementById('myForm');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const name = formData.get('product', 'subproductname', 'addprice');
      form.reset();
      // refetchProductCount;
      console.log('Data submitted successfully');
    });
  }
  return (
    <Page narrowWidth>
      <TitleBar title="App name" primaryAction={null} />
      <Layout>
        <Layout.Section>
          <Card sectioned>
          <form id="myForm" onSubmit={handleSubmit}>
              <input type="hidden" label="Product id" className="hidden" id="product_id" name="product_id"  onInput={handleChange}  />
             
              <input type="hidden" label="Product Name" className="hidden" id="productname" name="productname" onChange={handleChange} />
             
              <label for="product">Choose Brands:</label> <br /> <br />
              {/* <datalist id="product" >
              <option value="" disabled selected hidden>--Select Model--</option>
              </datalist>
              <input  autoComplete="on" list="product" onChange={chkind}/> */}
              {/* <input type="text" placeholder="search countries" onKeyUp={getOption}></input> */}
              <select name="product" id="product" class="form-control select2" onChange={chkind}>
                <option value="" disabled selected hidden>--Select Model--</option>
              </select>

              <br />
              <br />
              <label for="subproduct">Add Sub Product:</label><br />
              <input type="text" label="Add subProduct Name" id="subproduct" name="subproductname"  onChange={handleChange} />
              <br />
              <br />
              <label for="price">Add Price:</label><br />
              <input type="number" label="price Name" name="addprice" id="price"  onChange={handleChange} />
              <br />
              <br />
              <button type="submit" id="btn">Submit</button>
            </form>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <SubProductList />
          <ProductsCard />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
