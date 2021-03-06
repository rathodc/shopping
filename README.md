# Shopping Application
Repository Created for Shopping Application - Browse Only

### This is a simple shopping application with following features :-<br>
1.Provides an endpoint to add a category to a root category or sub-category<br>
2.Provides an endpoint to add a product to single/multiple categories<br>
3.Provides an endpoint to list all categories along with it's subcategories starting from root category<br>
4.Provides an endpoint to list all products associated with a particular category<br>
5.Provides an endpoint to update product information<br>
<br>
### Each Category added to your "shopping" application contains following information :-<br>
1.Category ID - This is generated automatically by the application<br>
2.Category Title - This is the name which user can select while adding a particular category<br>
3.Parent ID - This is the parent id which user must specify while adding any category<br>
4.Has Category - This is the flag automatically generated by the application,it defaults to 'false' and switched to 'true' when a sub-category is added to this category<br>
5.Has Product - This is the flag automatically generated by the application,it defaults to 'false' and switched to 'true' when a product is added to this category<br>

### Each Product added to your "shopping" application contains following information :-<br>
1.Product ID - This is generated automatically by the application<br>
2.Product Title - This is the name which user can select while adding a particular product<br>
3.Product Description - This is the description which user can select while adding a particular product<br>
4.Product Price - This is the price(along with currency) which user can select while adding a particular product<br>
5.Parent ID - This is the parent id which user must specify while adding any product to a particular category<br>

# Set-Up Instructions

Make sure you have latest version of nodejs and mongodb set up on your machine before proceeding to below steps<br>

### 1.Create a directory,say - shopping and clone the repository
```
chirag@chirag-rathod:~/heady/ins_test$ mkdir shopping
chirag@chirag-rathod:~/heady/ins_test$ git clone https://github.com/rathodc/shopping.git shopping/
Cloning into 'shopping'...
remote: Enumerating objects: 32, done.
remote: Counting objects: 100% (32/32), done.
remote: Compressing objects: 100% (21/21), done.
remote: Total 32 (delta 4), reused 29 (delta 4), pack-reused 0
Unpacking objects: 100% (32/32), done.
Checking connectivity... done.
chirag@chirag-rathod:~/heady/ins_test$ 
```

### 2.Install Application
```
chirag@chirag-rathod:~/heady/ins_test$ cd shopping/
chirag@chirag-rathod:~/heady/ins_test/shopping$ npm install

> circular-json@0.5.8 postinstall /home/chirag/heady/ins_test/shopping/node_modules/circular-json
> echo ''; echo -e "\x1B[1mCircularJSON\x1B[0m is in \x1B[4mmaintenance only\x1B[0m, \x1B[1mflatted\x1B[0m is its successor."; echo ''


-e \x1B[1mCircularJSON\x1B[0m is in \x1B[4mmaintenance only\x1B[0m, \x1B[1mflatted\x1B[0m is its successor.

npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN heady@1.0.0 No repository field.

added 147 packages in 8.291s
chirag@chirag-rathod:~/heady/ins_test/shopping$
```

### 3.Make sure mongodb is running with below commands
```
root@a4cb56e577fb:/# mongo
MongoDB shell version v4.0.3
connecting to: mongodb://127.0.0.1:27017
```

### 4.Edit config/default-1.json file to change the port number from 4000 to 27017
```
{
		"server": {
			"host": "localhost",
			"port": 3000
		},
		"db": {
			"host": "mongodb://localhost:27017",
			"db_name": "shopping"
		},
		"modules": [
			"catalog"
		]		
}

```

### 5.Start the Application
```
chirag@chirag-rathod:~/heady/ins_test/shopping$ npm start

> heady@1.0.0 start /home/chirag/heady/ins_test/shopping
> node main.js

/home/chirag/heady/ins_test/shopping/services/mongo_client
[2018-10-21T13:41:45.432] [INFO] start_up - Listening on port  3000  with pid  17570
Listening on 3000, Web URL: http://localhost:3000
(node:17570) DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.
[2018-10-21T13:41:45.478] [INFO] load_manager - Server started successfully
```

### 6.Unit Test
```
chirag@chirag-rathod:~/heady/ins_test/shopping$ npm test

> heady@1.0.0 test /home/chirag/heady/ins_test/shopping
> mocha



  Catalog APIs - Status and content
    Get Category List
      ✓ status
    Add Category
      ✓ status
    Add Product
      ✓ status
    Get Product List
      ✓ status
    Update Product
      ✓ status


  5 passing (68ms)

chirag@chirag-rathod:~/heady/ins_test/shopping$
```

# API Usage

**Add a Category**
----
  This api will help you add a category to a root category or a sub-category

* **URL**

  /api/v1/catalog/category

* **Method:**
  
  `POST`
  
*  **Header**

   All api calls requires an authorization which uniquely identifies a particular user.For this application use one of these auth tokens - "e4b76ae67e4b", "604605a6bfe0", "22437a5dc2f5"

   **Required:**
 
   `auth-token=[Token]`<br>
   `Content-Type=application/json`

* **Body**

  E.g json payload - `{"title":"Men's fashion","parent":"c27a64f0"}`

*  **Input Body Schema**
  `{    
    "type": "object",
    "properties": {
      "title": {"type": "string","minLenth" : 3,"maxLength" : 20},
      "parent": {"type": "string","minLenth" : 8,"maxLength" : 10}
	  },
	  "required": ["title","parent"]
  }`
  

* **Success Response:**
  
  * **Code:** 201 <br />
    **Content:** `{
    "_id": "40d66350",
    "parent_id_list": [
      "c27a64f0"
    ],
    "has_category": false,
    "has_product": false,
    "title": "Romance"
  }`
 
* **Error Response:**

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{"error_title":"Bad Request","error_message":"Not Authenticated"}`

  * **Code:** 400 Bad Request <br />
    **Content:** `{"error_title":"Bad Request","error_message":"Cannot add category"}`  


**Add a Product**
----
  This api will help you add a product to a particular category/sub-category

* **URL**

  /api/v1/catalog/product

* **Method:**
  
  `POST`
  
*  **Header**

   All api calls requires an authorization which uniquely identifies a particular user.For this application use one of these auth tokens - "e4b76ae67e4b",  "604605a6bfe0", "22437a5dc2f5"

   **Required:**
 
   `auth-token=[Token]`<br>
   `Content-Type=application/json`

* **Body**

  E.g json payload - `{"title":"Redux Analogue Brown Dial Men's & Boy's Watch","price":"USD 10000","parent":"b3364170"}`

  E.g json payload to associate product to another category - `{"title":"Redux Analogue Brown Dial Men's & Boy's Watch","price":"USD 10000","parent":"c3364170","_id":"aa52bac0"}` where
  "aa52bac0" is the id of product already added and "c3364170" is the another category to which this product needs to be associated

*  **Input Body Schema**
  `{    
      "type": "object",
      "properties": {
        "title": {"type": "string","minLength" : 3,"maxLength" : 50},
        "parent": {"type": "string","minLength" : 8,"maxLength" : 10},
        "price":{"type": "string","minLength" : 6,"maxLength" : 10},
        "description":{"type": "string","maxLength" : 100},
        "_id":{"type": "string","minLength" : 8,"maxLength" : 10},
      },
      "required": ["title","parent","price"]
  }`  
  

* **Success Response:**  

  * **Code:** 201 <br />
    **Content:** `{
    "_id": "175a2e30",
    "description": "",
    "parent_id_list": [
        "b3364170"
    ],
    "price": "USD 10000",
    "title": "jfjejfej fnrlnengl"
  }`
 
* **Error Response:**

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{"error_title":"Bad Request","error_message":"Not Authenticated"}`

  * **Code:** 400 Bad Request <br />
    **Content:** `{"error_title":"Bad Request","error_message":"Cannot add product"}`  

**Update a Product**
----
  This api will help you update product information

* **URL**

  /api/v1/catalog/product/:id

* **Method:**
  
  `PUT`
  
*  **Header**

   All api calls requires an authorization which uniquely identifies a particular user.For this application use one of these auth tokens - "e4b76ae67e4b",  "604605a6bfe0", "22437a5dc2f5"

   **Required:**
 
   `auth-token=[Token]`<br>
   `Content-Type=application/json`

* **Body**

  E.g json payload - `{"title":"New Title","price":"USD 10000","description":"New Desc"}`

*  **Input Body Schema**
  `{"type":"object","properties":{"title":{"type":"string"},"price":{"type":"string"},"description":{"type":"string"}}}`  
  

* **Success Response:**  

  * **Code:** 200 <br />
    **Content:** `{"_id":"175a2e30","description":"New Desc","parent_id_list":["b3364170"],"price":"USD 10000","title":"New Title"}`
 
* **Error Response:**

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{"error_title":"Bad Request","error_message":"Not Authenticated"}`

  * **Code:** 400 Bad Request <br />
    **Content:** `{
      "error_title": "Bad Request",
      "error_message": "Could not update product"
    }`  

**Get Category List**
----
  This api will help you get all categories and its sub-categories in a tree-like structure

* **URL**

  /api/v1/catalog/category_list

* **Method:**
  
  `GET`
  
*  **Header**

   All api calls requires an authorization which uniquely identifies a particular user.For this application use one of these auth tokens - "e4b76ae67e4b",  "604605a6bfe0", "22437a5dc2f5"

   **Required:**
 
   `auth-token=[Token]`<br>
   `Content-Type=application/json`

* **Success Response:**  

  * **Code:** 200 <br />
    **Content:** `{"title":"Home","_id":"a37ab6f0","has_category":true,"has_product":false,"child_items":[{"_id":"c27a64f0","has_category":true,"has_product":false,"title":"Men's Fashion","child_items":[{"_id":"40d66350","has_category":false,"has_product":true,"title":"Watches","child_items":[]}]},{"_id":"c2fc0620","has_category":false,"has_product":true,"title":"Electronics","child_items":[]}]}`
 
* **Error Response:**

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{"error_title":"Bad Request","error_message":"Not Authenticated"}`

**Get Product List**
----
  This api will help you get all products associated to a particular category

* **URL**

  /api/v1/catalog/product_list

* **Method:**
  
  `GET`
  
*  **Header**

   All api calls requires an authorization which uniquely identifies a particular user.For this application use one of these auth tokens - "e4b76ae67e4b",  "604605a6bfe0", "22437a5dc2f5"

   **Required:**
 
   `auth-token=[Token]`<br>
   `Content-Type=application/json`

*  **Query String Params**   

   **Required:**
 
   `category=[parent_category_id]`<br>

* **Success Response:**  

  * **Code:** 200 <br />
    **Content:** `[{"_id":"b3372bd0","description":"","parent_id_list":["b3364170"],"price":"USD 200","title":"Redux Analogue Brown Dial Men's & Boy's Watch"},{"_id":"175a2e30","description":"New Desc","parent_id_list":["b3364170"],"price":"USD 10000","title":"New Title"}]`
 
* **Error Response:**

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{"error_title":"Bad Request","error_message":"Not Authenticated"}`
* **Error Response:**

  * **Code:** 400 Bad Request <br />
    **Content:** `{"error_title":"PARAM_MISSING","error_message":"Required parameter 'category' missing"}`
