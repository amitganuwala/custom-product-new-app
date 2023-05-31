import { useState } from "react";
import { Card, TextContainer, Text } from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import React, { useEffect } from "react";
import "../assets/css/style.css";

export function ProductsCard() {
  const emptyToastProps = { content: null };
  const [isLoading, setIsLoading] = useState(true);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const fetch = useAuthenticatedFetch();

  const {
    data,
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
    isRefetching: isRefetchingCount,
  } = useAppQuery({
    url: "/api/products/all",
    
  });

  const toastMarkup = toastProps.content && !isRefetchingCount && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  const handlePopulate = async () => {
    setIsLoading(true);
    const response = await fetch("/api/products/create");

    if (response.ok) {
      await refetchProductCount();
      setToastProps({ content: "5 products created!" });
    } else {
      setIsLoading(false);
      setToastProps({
        content: "There was an error creating products",
        error: true,
      });
    }
  };
  useEffect(() => {
    listPopulate();
  },[])
  
  const listPopulate = async () => {
    const title = document.getElementById('product');
    const response = await refetchProductCount();
    var productlist = [];
    productlist = response.data;
    const itm = productlist.data;
    const itmjson = JSON.stringify(itm);
    var items = JSON.parse(itmjson);  
    // document.getElementById("datalistv").value = items;
    for (var option of items ) {
      const newOption = document.createElement("option");
      newOption.value = option.id;
      newOption.text = option.title;
      title.appendChild(newOption);
    }  
  };

  return (
    <>
    
    </>
  );
}
