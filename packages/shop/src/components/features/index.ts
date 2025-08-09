import { CartStatus as CartStatus_ } from "./cart";
import { OrderList as OrderList_ } from "./order";
import { PatronList as PatronList_ } from "./patron_list";
import { ProductImageCardList as ProductImageCardList_, ProductList as ProductList_ } from "./product";
import { UserInfo as UserInfo_ } from "./user_status";

namespace FeatureComponents {
  export const CartStatus = CartStatus_;
  export const OrderList = OrderList_;
  export const ProductList = ProductList_;
  export const ProductImageCardList = ProductImageCardList_;
  export const UserInfo = UserInfo_;
  export const PatronList = PatronList_;
}

export default FeatureComponents;
