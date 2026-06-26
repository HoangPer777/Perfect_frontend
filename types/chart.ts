export interface BarChartItem {
    name: string;      
    revenue: number;   
    orders: number;    
}

export interface PieChartItem {
    name: string;      
    value: number;     
}

export interface PeriodStats {
    revenue: string;   
    orders: string;    
    revChange: string; 
    ordChange: string; 
}

export interface PeriodDetail {
    stats: PeriodStats;
    bar: BarChartItem[];
    pie: PieChartItem[];
    totalPie: string;  
}

export interface DesignerChartResponse {
    'This Week': PeriodDetail;
    'This Month': PeriodDetail;
    'This Year': PeriodDetail;
}