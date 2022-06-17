import User from '../../entities/User';
import GQLUser from './user/User';
import AdditionalUserInfo from '../../entities/AdditionalUserInfo';
import GQLAdditionalUserInfo from './user/AdditionalUserInfo';
import Order from '../../entities/Order';
import GQLOrder from './order/Order';
import GQLBag from './bag/Bag';
import Bag from '../../entities/Bag';
import GQLCart from './cart/Cart';
import Cart from '../../entities/Cart';
import GQLRequestedPayment from 'graphql/entities/payment/RequestedPayment';
import {RequestedPayment} from 'entities/Payment';
import OrderInfo from '../../entities/OrderInfo';
import GQLOrderInfo from './order/OrderInfo';
import Courier from 'entities/Courier';
import Client from 'entities/Client';
import GQLClient from 'graphql/entities/user/Client';
import GQLCourier from 'graphql/entities/user/Courier';
import Account from '../../entities/Account';
import GQLAccount from './account/Account';
import LatLng from 'entities/LatLng';
import GQLLatLng from './address/LatLng';
import GQLAddress from 'graphql/entities/address/Address';
import Address from 'entities/Address';
import GQLIngredient from 'graphql/entities/ingredient/Ingredient';
import Ingredient from 'entities/Ingredient';
import GQLStatus from 'graphql/entities/status/Status';
import Status from 'entities/Status';
import GQLDish from 'graphql/entities/dish/Dish';
import Dish from 'entities/Dish';
import GQLSet from 'graphql/entities/set/Set';
import Set from 'entities/Set';
import GQLCuisine from 'graphql/entities/cuisine/Cuisine';
import Cuisine from 'entities/Cuisine';
import GQLRestaurant from 'graphql/entities/restaurant/Restaurant';
import Restaurant from 'entities/Restaurant';
import Preferences from '../../entities/Preferences';
import GQLPreferences from 'graphql/entities/user/Preferences';
import {Document, DocumentsRevision} from 'entities/Document';
import GQLDocument from 'graphql/entities/document/Document';
import GQLRevision from 'graphql/entities/document/DocumentsRevision';
import SetIdAndDay from 'entities/SetIdAndDay';
import GQLSetIdAndDay from 'graphql/entities/set/SetIdAndDay';
import GQLEmailForSpam from 'graphql/entities/emailForSpam/EmailForSpam';
import EmailForSpam from 'entities/EmailForSpam';

export const mapBagToGQL = (bag: Bag): GQLBag => ({
  id: bag.id,
  code: bag.code,
});

export const mapSetIdAndStatusToGQL = (setIdAndDay: SetIdAndDay): GQLSetIdAndDay => ({
  setId: setIdAndDay.setId,
  day: setIdAndDay.day,
});

export const mapCartToGQL = (cart: Cart): GQLCart => ({
  id: cart.id,
  userId: cart.userId,
  status: cart.status,
});

export const mapCartsToGQL = (carts: Cart[]): GQLCart[] => {
  return carts.map(mapCartToGQL);
};

export const mapBagsToGQL = (bags: Bag[]): GQLBag[] => {
  return bags.map(mapBagToGQL);
};

export const mapCartsFromDb = (carts: Cart[]): GQLCart[] => {
  return carts.map(mapCartToGQL);
};

export const mapRequestedPaymentToGQL = (
  payment: RequestedPayment,
): GQLRequestedPayment => ({
  orderId: payment.orderId,
  redirectUrl: payment.redirectUrl,
  status: payment.status,
});

export const mapIngredientToGQL = (ingredient: Ingredient): GQLIngredient => ({
  id: ingredient.id,
  name: ingredient.name,
});

export const mapIngredientsToGQL = (ingredients: Ingredient[]): GQLIngredient[] => {
  return ingredients.map(mapIngredientToGQL);
};

export const mapStatusToGQL = (status: Status): GQLStatus => ({
  id: status.id,
  name: status.name,
  imageId: status.imageId,
});

export const mapStatusesToGQL = (statuses: Status[]): GQLStatus[] => {
  return statuses.map(mapStatusToGQL);
};

export const mapDishToGQL = (dish: Dish): GQLDish => ({
  id: dish.id,
  name: dish.name,
  description: dish.description,
  imageId: dish.imageId,
  weight: dish.weight,
  kal: dish.kal,
  ingredients: dish.ingredients,
});

export const mapDishesToGQL = (dishes: Dish[]): GQLDish[] => {
  return dishes.map((dish) => mapDishToGQL(dish));
};

export const mapSetToGQL = (set: Set): GQLSet => ({
  id: set.id,
  name: set.name,
  imageId: set.imageId,
  cuisineId: set.cuisineId,
  priceCents: set.priceCents,
  dishes: set.dishes,
  statuses: set.statuses,
  day: set.day,
  isFavorite: set.isFavorite,
});

export const mapSetsToGQL = (sets: Set[]): GQLSet[] => {
  return sets.map(mapSetToGQL);
};

export const mapCuisineToGQL = (cuisine: Cuisine): GQLCuisine => ({
  id: cuisine.id,
  imageId: cuisine.imageId,
  nationality: cuisine.nationality,
  rating: cuisine.rating,
});

export const mapCuisinesToGQL = (cuisines: Cuisine[]): GQLCuisine[] => {
  return cuisines.map(mapCuisineToGQL);
};

export const mapRestaurantToGQL = (restaurant: Restaurant): GQLRestaurant => ({
  id: restaurant.id,
  user: restaurant.user,
  imageId: restaurant.imageId,
  address: restaurant.address,
  title: restaurant.title,
  description: restaurant.description,
  cuisines: restaurant.cuisines,
});

export const mapRestaurantsToGQL = (restaurants: Restaurant[]): GQLRestaurant[] => {
  return restaurants.map(mapRestaurantToGQL);
};

export const mapLatLngToGQL = (location: LatLng): GQLLatLng => ({
  lat: location.lat,
  lng: location.lng,
});

export const mapAdditionalUserInfoToGQL = (
  additionalInfo: AdditionalUserInfo,
): GQLAdditionalUserInfo => ({
  phoneNumber: additionalInfo.phoneNumber,
  email: additionalInfo.email,
});

export const mapLocationToGQL = (address: Address): GQLAddress => ({
  id: address.id,
  placeId: address.placeId,
  description: address.description,
  entrance: address.entrance,
  floor: address.floor,
  apartment: address.apartment,
  date: address.date,
  lat: address.lat,
  lng: address.lng,
});

export const mapLocationsToGQL = (addresses: Address[]): GQLAddress[] => {
  return addresses.map(mapLocationToGQL);
};

export const mapOrderInfoToGQL = (orderInfo: OrderInfo): GQLOrderInfo => ({
  id: orderInfo.id,
  clientAddress: mapLocationToGQL(orderInfo.clientAddress),
  distanceMiles: orderInfo.distanceMiles,
  priceCents: orderInfo.priceCents,
});

export const mapUserToGQL = (user: User): GQLUser => {
  return {
    id: user.id,
    image: user.image,
    name: user.name,
    preferencesId: user.preferencesId,
    lat: user.lat,
    lng: user.lng,
    additionalUserInfo: user.additionalUserInfo
      ? mapAdditionalUserInfoToGQL(user.additionalUserInfo)
      : undefined,
  };
};

export const mapClientToGQL = (client: Client): GQLClient => ({
  id: client.id,
  user: mapUserToGQL(client.user),
});

export const mapClientsToGQL = (clients: Client[]): GQLClient[] =>
  clients.map(mapClientToGQL);

export const mapDocumentToGQL = (document: Document): GQLDocument => ({
  id: document.id,
  fileId: document.fileId,
  group: document.group,
});

export const mapDocumentsToGQL = (documents: Document[]): GQLDocument[] =>
  documents.map(mapDocumentToGQL);

export const mapDocumentsRevisionToGQL = (revision: DocumentsRevision): GQLRevision => ({
  id: revision.id,
  comment: revision.comment,
  status: revision.status,
});

export const mapCourierToGQL = (courier: Courier): GQLCourier => ({
  id: courier.id,
  user: mapUserToGQL(courier.user),
  revision: courier.revision ? mapDocumentsRevisionToGQL(courier.revision) : undefined,
});

export const mapCouriersToGQL = (couriers: Courier[]): GQLCourier[] =>
  couriers.map(mapCourierToGQL);

export const mapOrderToGQL = (order: Order): GQLOrder => {
  return {
    id: order.id,
    restaurant: order.restaurant ? mapRestaurantToGQL(order.restaurant) : undefined,
    client: mapUserToGQL(order.client),
    cart: mapCartToGQL(order.cart),
    bag: order.bag ? mapBagToGQL(order.bag) : undefined,
    set: mapSetToGQL(order.set),
    number: order.number,
    orderInfo: mapOrderInfoToGQL(order.orderInfo),
    created: order.created,
    placement: order.placement,
    state: order.state,
    courierId: order.courierId,
    courier: order.courier,
    rating: order.rating,
    date: order.date,
  };
};

export const mapOrdersToGQL = (orders: Order[]): GQLOrder[] =>
  orders.map((order) => mapOrderToGQL(order));

export const mapPreferencesToGQL = (preferences: Preferences): GQLPreferences => ({
  id: preferences.id,
  allowPushNotifications: preferences.allowPushNotifications,
  allowEmailNotifications: preferences.allowEmailNotifications,
  allowSmsNotifications: preferences.allowSmsNotifications,
});

export const mapAccountToGQL = (account: Account): GQLAccount => ({
  user: mapUserToGQL(account.user),
  info: mapAdditionalUserInfoToGQL(account.info),
  preferences: mapPreferencesToGQL(account.preferences),
});

export const mapEmailForSpamToGQL = (email: EmailForSpam): GQLEmailForSpam => ({
  id: email.id,
  email: email.email,
  isDiscount: email.isDiscount,
});
