var expect  = require('chai').expect;
var request = require('request');
var root="";
var child_cat = "";
var product_added="";
var host = "http://localhost:3000"

describe('Catalog APIs - Status and content', function() {

    describe ('Get Category List', function() {
        it('status', function(done){
            var options = {
                uri: host+"/api/v1/catalog/category_list",
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token':'dqqwd'
                }
            }            
            request(options, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                root = JSON.parse(body)._id;
                done();
            });
        });    
    });


    describe ('Add Category', function() {
        it('status', function(done){
            var options = {
                uri: host+"/api/v1/catalog/category",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token':'dqqwd'
                },
                json:true,
                body:{title:'Men\'s Fashion',parent:root}    
            }            
            request(options, function(error, response, body) {
                expect(response.statusCode).to.equal(201);
                expect(body.title).to.equal('Men\'s Fashion')
                child_cat = body._id
                done();
            });
        });    
    });

    describe ('Add Product', function() {
        it('status', function(done){
            var options = {
                uri: host+"api/v1/catalog/product/",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token':'dqqwd'
                },
                json:true,
                body:{title:'Redux Analogue Brown Dial Men\'s & Boy\'s Watch',price:"USD 200",parent:child_cat}    
            }            
            request(options, function(error, response, body) {
                expect(response.statusCode).to.equal(201);
                expect(body.title).to.equal('Redux Analogue Brown Dial Men\'s & Boy\'s Watch')
                product_added = body._id
                done();
            });
        });    
    });

    describe ('Get Product List', function() {
        it('status', function(done){
            var options = {
                uri: host+"/api/v1/catalog/product_list",
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token':'dqqwd'
                },
                qs:{category:child_cat}                
            }            
            request(options, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                expect(body.length).to.be.at.least(1)
                product_added = JSON.parse(body)[0]._id
                done();
            });
        });    
    });

    describe ('Update Product', function() {
        it('status', function(done){
            var options = {
                uri: host+"/api/v1/catalog/product/"+product_added,
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token':'dqqwd'
                },
                json:true,
                body:{title:'New Product Title',description:'New Desc',price:'New Price'}
            }            
            request(options, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                expect(body.title).to.equal('New Product Title')
                expect(body.description).to.equal('New Desc')
                expect(body.price).to.equal('New Price')
                done();
            });
        });    
    });
});