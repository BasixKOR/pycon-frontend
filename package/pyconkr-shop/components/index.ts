import {
  OptionGroupInput as OptionGroupInputComponent,
  OrderProductRelationOptionInput as OrderProductRelationOptionInputComponent,
} from "./option_group_input";
import { PriceDisplay as PriceDisplayComponent } from "./price_display";
import { ShopSignInGuard as ShopSignInGuardComponent } from "./signin_guard";

namespace ShopComponent {
  export const OptionGroupInput = OptionGroupInputComponent;
  export const OrderProductRelationOptionInput = OrderProductRelationOptionInputComponent;
  export const PriceDisplay = PriceDisplayComponent;
  export const ShopSignInGuard = ShopSignInGuardComponent;
}

export default ShopComponent;
