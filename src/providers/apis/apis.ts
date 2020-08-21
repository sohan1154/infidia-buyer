import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { timeout, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { GlobalProvider } from "../../providers/globals/globals";

/*
  Generated class for the Apis Service Provider.

  See https://angular.io/guide/dependency-injection for more info on APIs service providers
  and Angular DI.
*/
@Injectable()
export class ApisService {

  // base url
  private baseUrl = 'http://localhost/infidia/api/';
  // private baseUrl = 'http://infidia.tk/api/';
  // private baseUrl = 'http://infidia.in/api/';

  private headers: any;
  private timeout: number = (30 * 1000);

  constructor(
    public http: HttpClient,
    public global: GlobalProvider
  ) {
    console.log('APIs service provider is called');

    // set defaul headers
    this.headers = new HttpHeaders();
    this.headers.set('Access-Control-Allow-Origin' , '*');
    this.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    this.headers.set('Content-Type', 'application/json');
  }

  login(params: any) {
    return this.http.post(this.baseUrl + 'login', params, { headers: this.headers }).pipe(timeout(this.timeout));
  }

  changePassword(params: any) {
    return this.http.post(this.baseUrl + 'changePassword', params, { headers: this.headers }).pipe(timeout(this.timeout));
  }

  sendOTP(params: any) {
    return this.http.post(this.baseUrl + 'sendOtp', params, { headers: this.headers }).pipe(timeout(this.timeout));
  }

  resendOTP(params: any) {
    return this.http.post(this.baseUrl + 'resendOtp', params, { headers: this.headers }).pipe(timeout(this.timeout));
  }

  verifyOTP(params: any) {
    return this.http.post(this.baseUrl + 'verifyOtp', params, { headers: this.headers }).pipe(timeout(this.timeout));
  }

  getAllStaticAndDynamicLists() {
    return this.http.get(this.baseUrl + 'get-all-static-and-dynamic-lists', {params : {}, headers: this.headers }).pipe(timeout(this.timeout));
  }

  getCitiesStates() {
    return this.http.get(this.baseUrl + 'get-cities-states', {params : {}, headers: this.headers }).pipe(timeout(this.timeout));
  }

  updateProfile(params: any) {
    return this.http.post(this.baseUrl + 'updateUserDetails', params, { }).pipe(timeout(this.timeout));
  }

  uploadProfileImage(params: any) {
    return this.http.post(this.baseUrl + 'profiles/upload-profile-image', params, { }).pipe(timeout(this.timeout));
  }
  
  makePayment(params: any) {
    return this.http.post(this.baseUrl + 'make-payment', params, { headers: this.headers }).pipe(timeout(this.timeout));
  }
  
  shareFeedback(params: any) {
    return this.http.post(this.baseUrl + 'shareFeedback', params, { headers: this.headers }).pipe(timeout(this.timeout));
  }
  
  resetBadge(params: any) {
    return this.http.post(this.baseUrl + 'reset-badge', params, {headers: this.headers }).pipe(timeout(this.timeout));
  }
  
  staticPage(params: any) {
    return this.http.get(this.baseUrl + 'pages', { params: params, headers: this.headers }).pipe(timeout(this.timeout));
  }
  
  homeData(params: any) {
    // let postData = 'role=' + this.role + '&user_id=' + userid + '&app_id=' + deviceid;
    return this.http.post(this.baseUrl + 'homePage', params, { }).pipe(timeout(this.timeout));
  }

  categoryListing(params: any) {
    return this.http.post(this.baseUrl + 'categories', params, { }).pipe(timeout(this.timeout));
  }

  storesListBasedCategory(params: any) {
    // let postData = 'cat_id=' + catID + '&search=' + search;
    return this.http.post(this.baseUrl + 'storeListBasedCatList', params, { }).pipe(timeout(this.timeout));
  }

  productsListBasedCategory(params: any) {
    // let postData = 'cat_id=' + catID + '&search=' + search;
    return this.http.post(this.baseUrl + 'productListBasedCatList', params, { }).pipe(timeout(this.timeout));
  }

  shopListing(params: any) {
    //let postData = 'latitude=' + lat + '&longitude=' + lng;
    return this.http.post(this.baseUrl + 'shop_list', params, { }).pipe(timeout(this.timeout));
  }

  shoplistFilter(params: any) {
    //let postData = 'latitude=' + lat + '&longitude=' + lng + '&order=' + orderItem + '&star=' + avgRating + '&min_distance=' + min_distance + '&max_distance=' + max_distance;
    return this.http.post(this.baseUrl + 'shoplistFilter', params, { }).pipe(timeout(this.timeout));
  }

  getOrderDetail(params: any) {
    return this.http.post(this.baseUrl + 'OrderDetails', params, { }).pipe(timeout(this.timeout));
  }

  updateOrderStatus(params: any) {
    return this.http.post(this.baseUrl + 'updateOrderStatus', params, { }).pipe(timeout(this.timeout));
  }
  
  getStorePageData(params: any) {
    return this.http.post(this.baseUrl + 'get-store-page-data', params, { }).pipe(timeout(this.timeout));
  }
  
  storeProductList(params: any) {
    // let postData = 'shop_id=' + ShopID + '&user_id=' + userID + '&product_category_id=' + productCatID;
    return this.http.post(this.baseUrl + 'productList', params, { }).pipe(timeout(this.timeout));
  }

  getProductDetail(params: any) {
    // let postData = 'product_id=' + productID + '&user_id=' + userID;
    return this.http.post(this.baseUrl + 'productDetails', params, { }).pipe(timeout(this.timeout));
  }

  addToCart(params: any) {
    // let postData = 'user_id=' + user_id + '&app_id=' + app_id + '&app_type=' + app_type + '&product_id=' + product_id + '&product_attr_id=' + product_attr_id + '&price=' + price + '&qty=' + qty;
    return this.http.post(this.baseUrl + 'addCart', params, { }).pipe(timeout(this.timeout));
  }

  emptyCart(params: any) {
    // let postData = 'user_id=' + user_id;
    return this.http.post(this.baseUrl + 'emptyCart', params, { }).pipe(timeout(this.timeout));
  }

  addOrRemoveWishlist(params: any) {
    // let postData = 'user_id=' + user_id + '&app_id=' + app_id + '&app_type=' + app_type + '&product_id=' + product_id + '&product_attr_id=' + product_attr_id + '&price=' + price + '&qty=' + qty;
    return this.http.post(this.baseUrl + 'addOrRemoveWishlist', params, { }).pipe(timeout(this.timeout));
  }

  userCashOrder(params: any) {
    // let postData = 'user_id=' + options.user_id + '&app_id=' + options.app_id + '&payment_status=' + options.payment_status + '&tnx_id=' + options.tnx_id + '&amount=' + options.amount + '&billing_address=' + options.billing_address + '&shipping_address=' + options.shipping_address + '&total_amount=' + options.total_amount + '&product_attr_id=' + options.product_attr_id + '&product_id=' + options.product_id + '&qty=' + options.qty + '&seller_id=' + options.seller_id;
    return this.http.post(this.baseUrl + 'userCashOrder', params, { }).pipe(timeout(this.timeout));
  }
  
  userOrder(params: any) {
    // let postData = 'user_id=' + options.user_id + '&app_id=' + options.app_id + '&payment_status=' + options.payment_status + '&tnx_id=' + options.tnx_id + '&amount=' + options.amount + '&billing_address=' + options.billing_address + '&shipping_address=' + options.shipping_address + '&total_amount=' + options.total_amount + '&product_attr_id=' + options.product_attr_id + '&product_id=' + options.product_id + '&qty=' + options.qty + '&seller_id=' + options.seller_id;
    return this.http.post(this.baseUrl + 'userOrder', params, { }).pipe(timeout(this.timeout));
  }

  fetchAddress(params: any) {
    // let postData = 'user_id=' + user_id;
    return this.http.post(this.baseUrl + 'fetch_address', params, { }).pipe(timeout(this.timeout));
  }

  addAddress(params: any) {
    // let postData = 'user_id=' + user_id + '&type=' + type + '&location=' + location + '&house_no=' + house_no + '&address=' + address + '&landmark=' + landmark + '&latitude=' + latitude + '&longitude=' + longitude;
    return this.http.post(this.baseUrl + 'add_address', params, { }).pipe(timeout(this.timeout));
  }

  removeAddress(params: any) {
    // let postData = 'user_id=' + user_id + '&id=' + id;
    return this.http.post(this.baseUrl + 'delete_address', params, { }).pipe(timeout(this.timeout));
  }

  PastOrderDetails(params: any) {
    // let postData = 'user_id=' + user_id;
    return this.http.post(this.baseUrl + 'PastBuyerOrderDetails', params, { }).pipe(timeout(this.timeout));
  }

  productListWishlist(params: any) {
    // let postData = 'user_id=' + user_id + '&app_id=' + app_id;
    return this.http.post(this.baseUrl + 'getWishlistProducts', params, { }).pipe(timeout(this.timeout));
  }

  removeFromWishlist(params: any) {
    // let postData = 'user_id=' + user_id + '&app_id=' + app_id + '&id=' + id;
    return this.http.post(this.baseUrl + 'deleteProductFromWishlist', params, { }).pipe(timeout(this.timeout));
  }

  returnProduct(params: any) {
    // let postData = 'id=' + order_id + '&product_id=' + product_id + '&qty=' + qty;
    return this.http.post(this.baseUrl + 'updateOrderReturnStatus', params, { }).pipe(timeout(this.timeout));
  }

  cancelOrder(params: any) {
    // let postData = 'id=' + order_id;
    return this.http.post(this.baseUrl + 'updateOrderCancelStatus', params, { }).pipe(timeout(this.timeout));
  }

  productListCart(params: any) {
    // let postData = 'user_id=' + user_id + '&app_id=' + app_id;
    return this.http.post(this.baseUrl + 'getCartProducts', params, { }).pipe(timeout(this.timeout));
  }

  updateProductCart(params: any) {
    // let postData = 'cart_id=' + cart_id + '&price=' + price + '&qty=' + qty;
    return this.http.post(this.baseUrl + 'updateCart', params, { }).pipe(timeout(this.timeout));
  }

  removeFromCart(params: any) {
    // let postData = 'user_id=' + user_id + '&app_id=' + app_id + '&cart_id=' + cart_id;
    return this.http.post(this.baseUrl + 'deleteProductFromCart', params, { }).pipe(timeout(this.timeout));
  }

}
