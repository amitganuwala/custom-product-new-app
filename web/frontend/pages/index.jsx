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

  function chkind(){
    var dropdown1 = document.getElementById('product');
    var prodid = dropdown1.options[dropdown1.selectedIndex].value;
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
  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(values);
    axios.post('http://localhost:8081/varientdb', values)
      .then(res => {
        resetform();
      })
      .catch(err => console.log(err));
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
