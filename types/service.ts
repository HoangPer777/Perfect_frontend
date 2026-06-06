export interface ServicePackageResponse{
    id: string;
    title: string;
    description: string; 
    packageType: string;
    price: number;
    deliveryDays: number;
    revisionsLimit: number;
}