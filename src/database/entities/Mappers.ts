import User from '../../entities/User';
import DbUser from './User';
import Account from '../../entities/Account';
import DbAddress from 'database/entities/Address';
import Address from 'entities/Address';
import SpoonError from '../../SpoonError';
import Ingredient from 'entities/Ingredient';
import DbIngredient from './Ingredient';
import Status from 'entities/Status';
import DbStatus from './Status';
import Dish from 'entities/Dish';
import DbDish from './Dish';
import Preferences from 'entities/Preferences';
import DbPreferences from './Preferences';
import Set from 'entities/Set';
import DbSet from './Set';
import Cuisine from 'entities/Cuisine';
import DbCuisine from './Cuisine';
import Restaurant from 'entities/Restaurant';
import DbRestaurant from './Restaurant';
import Client from 'entities/Client';
import Courier from 'entities/Courier';
import DbClient from './Client';
import DbCourier from './Courier';
import DbBag from './Bag';
import Bag from 'entities/Bag';
import DbCart from './Cart';
import Cart from 'entities/Cart';
import DbOrder from './Order';
import Order from '../../entities/Order';
import OrderInfo from '../../entities/OrderInfo';
import DbOrderInfo from './OrderInfo';
import Admin from '../../entities/Admin';
import DbAdmin from './Admin';
import EmailForSpam from '../../entities/EmailForSpam';
import DbEmailForSpam from './EmailsForSpam';
import {Document, DocumentsRevision} from 'entities/Document';
import DbDocument from './Document';
import DbDocumentRevision from './DocumentsRevision';

import AdditionalUserInfo from 'entities/AdditionalUserInfo';
import LatLng from 'entities/LatLng';

export const mapLatLngFromDb = (location: DbUser): LatLng => ({
  lng: location.lng,
  lat: location.lat,
});

export const mapBagFromDb = (bag: DbBag): Bag => {
  return {
    id: bag.id,
    code: bag.code,
  };
};

export const mapCartFromDb = (cart: DbCart): Cart => {
  return {
    id: cart.id,
    userId: cart.userId,
    status: cart.status,
  };
};

export const mapBagsFromDb = (bags: DbBag[]): Bag[] => {
  return bags.map(mapBagFromDb);
};

export const mapIngredientFromDb = (ingredient: DbIngredient): Ingredient => ({
  id: ingredient.id,
  name: ingredient.name,
});

export const mapIngredientsFromDb = (ingredients: DbIngredient[]): Ingredient[] => {
  return ingredients.map(mapIngredientFromDb);
};

export const mapDishFromDb = (dish: DbDish): Dish => {
  if (!dish.ingredients) throw new SpoonError('Dish has no ingredients');

  return {
    id: dish.id,
    name: dish.name,
    description: dish.description,
    imageId: dish.imageId,
    weight: dish.weight,
    kal: dish.kal,
    ingredients: mapIngredientsFromDb(dish.ingredients),
  };
};

export const mapDishesFromDb = (dishes: DbDish[]): Dish[] => {
  return dishes.map(mapDishFromDb);
};

export const mapStatusFromDb = (status: DbStatus): Status => ({
  id: status.id,
  name: status.name,
  imageId: status.imageId,
});

export const mapStatusesFromDb = (statuses: DbStatus[]): Status[] => {
  return statuses.map(mapStatusFromDb);
};

export const mapSetFromDb = (set: DbSet): Set => {
  if (!set.dishes) throw new SpoonError('Set has no dishes');
  if (!set.statuses) throw new SpoonError('Set has no statuses');

  return {
    id: set.id,
    name: set.name,
    imageId: set.imageId,
    cuisineId: set.cuisineId,
    priceCents: set.priceCents,
    dishes: mapDishesFromDb(set.dishes),
    statuses: mapStatusesFromDb(set.statuses),
    day: set.day,
    isFavorite: set.isFavorite,
  };
};

export const mapSetsFromDb = (sets: DbSet[]): Set[] => {
  return sets.map(mapSetFromDb);
};

export const mapCuisineFromDb = (cuisine: DbCuisine): Cuisine => ({
  id: cuisine.id,
  imageId: cuisine.imageId,
  nationality: cuisine.nationality,
  rating: cuisine.rating,
});

export const mapCuisinesFromDb = (cuisines: DbCuisine[]): Cuisine[] => {
  return cuisines.map(mapCuisineFromDb);
};

export const mapAddressFromDB = (address: DbAddress): Address => {
  return {
    id: address.id,
    placeId: address.placeId,
    lat: address.lat,
    lng: address.lng,
    description: address.description,
    entrance: address.entrance,
    floor: address.floor,
    apartment: address.apartment,
    date: address.date,
  };
};

export const mapAddressesFromDB = (addresses: DbAddress[]): Address[] => {
  return addresses.map(mapAddressFromDB);
};

export const mapAdditionalUserInfoFromDb = (user: DbUser): AdditionalUserInfo => ({
  email: user.email,
  phoneNumber: user.phoneNumber,
});

export const mapUserFromDb = (
  user: DbUser,
  addAdditionalInfo: boolean = false,
): User => ({
  id: user.id,
  image: user.image ? user.image.id : user.imageId,
  name: user.name,
  preferencesId: user.preferencesId,
  lat: user.lat,
  lng: user.lng,
  additionalUserInfo: addAdditionalInfo ? mapAdditionalUserInfoFromDb(user) : undefined,
});

export const mapRestaurantFromDb = (restaurant: DbRestaurant): Restaurant => {
  if (!restaurant.cuisines) throw new SpoonError('Restaurant has no cuisines');
  if (!restaurant.user) throw new SpoonError('Restaurant has no user');

  return {
    id: restaurant.id,
    user: mapUserFromDb(restaurant.user, true),
    imageId: restaurant.imageId,
    address: mapAddressFromDB(restaurant.address),
    title: restaurant.title,
    description: restaurant.description,
    cuisines: mapCuisinesFromDb(restaurant.cuisines),
  };
};

export const mapRestaurantsFromDb = (restaurants: DbRestaurant[]): Restaurant[] => {
  return restaurants.map(mapRestaurantFromDb);
};

export const mapClientFromDb = (client: DbClient): Client => {
  if (!client.user) throw new SpoonError('Client user data not exist');

  return {
    id: client.id,
    user: mapUserFromDb(client.user, true),
  };
};

export const mapClientsFromDb = (clients: DbClient[]): Client[] =>
  clients.map(mapClientFromDb);

export const mapDocumentFromDb = (document: DbDocument): Document => ({
  id: document.id,
  fileId: document.fileId,
  group: document.group,
});

export const mapDocumentsFromDb = (documents: DbDocument[]): Document[] =>
  documents.map(mapDocumentFromDb);

export const mapDocumentRevisionFromDb = (
  revision: DbDocumentRevision,
): DocumentsRevision => ({
  id: revision.id,
  comment: revision.comment,
  status: revision.status,
});

export const mapCourierFromDb = (courier: DbCourier): Courier => {
  if (!courier.user) throw new SpoonError('Courier user data not exist');
  return {
    id: courier.id,
    user: mapUserFromDb(courier.user, true),
    revision: courier.revision ? mapDocumentRevisionFromDb(courier.revision) : undefined,
  };
};

export const mapCouriersFromDb = (couriers: DbCourier[]): Courier[] =>
  couriers.map(mapCourierFromDb);

export const mapOrderInfoFromDb = (orderInfo: DbOrderInfo): OrderInfo => {
  return {
    id: orderInfo.id,
    clientAddress: mapAddressFromDB(orderInfo.clientAddress),
    distanceMiles: orderInfo.distanceMiles,
    priceCents: orderInfo.priceCents,
  };
};

export const mapOrderFromDb = (order: DbOrder): Order => {
  if (!order.set) throw new SpoonError('Order not have set');
  if (!order.client) throw new SpoonError('Client data not exist');
  if (!order.client.user) throw new SpoonError('Client user data not exist');
  if (!order.cart) throw new SpoonError('Cart data not exist');

  return {
    id: order.id,
    number: order.number,
    state: order.state,
    created: order.created,
    courierId: order.courierId,
    courier: order.courier ? mapCourierFromDb(order.courier) : undefined,
    placement: order.placement,
    rating: order.rating,
    client: mapUserFromDb(order.client.user, true),
    restaurant: order.restaurant ? mapRestaurantFromDb(order.restaurant) : undefined,
    bag: order.bag ? mapBagFromDb(order.bag) : undefined,
    orderInfo: mapOrderInfoFromDb(order.orderInfo),
    set: mapSetFromDb(order.set),
    cart: mapCartFromDb(order.cart),
    date: order.date,
  };
};

export const mapOrderListFromDb = (orders: DbOrder[]): Order[] => {
  return orders.map((order) => mapOrderFromDb(order));
};

export const mapEmailForSpamFromDB = (email: DbEmailForSpam): EmailForSpam => {
  return {
    id: email.id,
    email: email.email,
    isDiscount: email.isDiscount,
  };
};

export const mapEmailForSpamListFromDb = (emails: DbEmailForSpam[]): EmailForSpam[] => {
  return emails.map((email) => mapEmailForSpamFromDB(email));
};

export const mapPreferencesFromDb = (preferences: DbPreferences): Preferences => ({
  id: preferences.id,
  allowPushNotifications: preferences.allowPushNotifications,
  allowEmailNotifications: preferences.allowEmailNotifications,
  allowSmsNotifications: preferences.allowSmsNotifications,
});

export const mapAccountFromDB = (
  account: DbUser,
  preferences: DbPreferences,
): Account => ({
  user: mapUserFromDb(account),
  info: mapAdditionalUserInfoFromDb(account),
  preferences: mapPreferencesFromDb(preferences),
});

export const mapAdminFromDb = (admin: DbAdmin): Admin => {
  if (!admin.user) throw new SpoonError('Admin user data not exist');

  return {
    id: admin.id,
    user: mapUserFromDb(admin.user),
  };
};

export const mapAdminsFromDb = (admins: DbAdmin[]): Admin[] => admins.map(mapAdminFromDb);
