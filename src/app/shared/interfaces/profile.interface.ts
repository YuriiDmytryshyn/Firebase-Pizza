import { IOrder } from './order.interface';

export interface IProfile{
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    phone: string;
    city: string;
    street: string;
    house: string;
    orders: Array<IOrder>;
}