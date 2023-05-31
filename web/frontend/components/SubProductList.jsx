import { useState } from "react";
import { Card, TextContainer, Text, Layout } from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import React, { useEffect } from "react";

export function SubProductList() {

    useEffect(() => {
        const tableBody = document.querySelector('#users tbody');

    fetch('http://localhost:8081/getvarientsdata')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        // Update the HTML div with the retrieved data
        data.forEach((user) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.subproductname}</td>
            <td><b>+${user.addprice} $}</b></td>
            <td><button>DELETE</button></td>
      `;
            tableBody.appendChild(tr);
        });
    })
    .catch(err => console.log(err));
      },[])

      
    return (
    <>
    <Card>
         <div id="list">
            <table id="users">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </Card>
       
        
    </>
);
}
