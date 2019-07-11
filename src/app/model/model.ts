import { Time } from "@angular/common";

export class PassData{
    public messageType:string;
    public payload:any;
    constructor(msgType:string,data:any){
        this.messageType= msgType;
        this.payload= data;
    }
}
// export class Bizhour {
//     public date: Date;
//     public strdate: string;
//     public status: string;
//     public note: string;
//     public fromTime: Date;
//     public toTime: Date;

//     constructor(theDate: Date, thestrdate: string, theStatus: string, theNote: string, from: Date, to: Date) {
//         this.date = theDate;
//         this.strdate = thestrdate;
//         this.status = theStatus;
//         this.note = theNote;
//         this.fromTime = from;
//         this.toTime = to;
//     }
// }

export class AdUser {
    public id: Number;
    public name:string;
    public pWord:string;
   
  
}

export class UserInfo
{
    public name:string;
    public fullname;
    public password:string;;
  
}

export class BizHour {
    public id: Number;
    public country: string;
    public state: string;
    public city: string;
    public area: string;
    public location: string;
    public companyCode: string;
    public branchCode: string;
    public workDate: Date;
    public dayType: string;
    public fromHour: Date;
    public toHour: Date;
    public repeatType: string;
    public dayName: string;
    public note: string;
    public updateDate: Date;
    public updateBy: string;
    public createDate: Date;
    public createBy: string;
}

export class ItemImageInfo
{
    public itemCode:string;
    public itemName:string;
    public optionCode:string;
    public optionType:string;
    public optionName:string;
    public imageName:string;
    public priceType:string;
    public costPrice:number;
    public costWithGST:number;
    public costTaxAmount:number;
    public sellingPrice:number;
    public priceWithGST:number;
    public taxAmount:number;
     
}

export class OrderInfo                                      
{                                                        
    public   iD :number;                        
    public   country :string;                
    public   state :string;                  
    public   city :string;                   
    public   area :string;                   
    public   location :string;               
    public   orderNo :string;                
    public   orderStatus :string;            
    public   orderDate :Date;           
    public   memberID :string;               
    public   totalAmount :Number;         
    public   promotionCode :string;          
    public   promotionValue :Number;     
    public   voucherCode :string;            
    public   redemptionCode :string;         
    public   voucherValue :Number;         
    public   netTotal :Number;            
    public   taxAmount :Number;          
    public   totalWithGST :Number;         
    public   deliveryCharge :Number;     
    public   deliverySurcharge :Number; 
    public   conciergeCharges :Number;   
    public   totalCost :Number;            
    public   paymentMethod :string;          
    public   deliveryType :string;           
    public   orderType :string;              
    public   deliveryDate :Date;        
    public   fromHour :string;            
    public   toHour :string;                       
    public   replaceOrderNo :string;         
    public   declinedReason :number;           
    public   isPaid :boolean;                 
    public   acountStatus :string;          
    public   runnerName :string;             
    public   updateDate :Date;          
    public   updateBy :string;               
    public   createDate :Date;          
    public   createBy :string;               
}     

export class vOrderItem {
    public id: string; //order dtl id
    public orderDate: Date;
    public orderNo: string;
    public paymentMethod: string;
    public fromHour: string;
    public toHour: string;
    public deliveryDate: Date;
    public orderLine: number;
    public lineStatus: string;
    public itemCode: string;
    public costWithGST: number;
    public priceWithGST: number;
    public quantity: number;
    public totalAmount: number;
    public totalAddonAmount: number;
    public netTotalAmount: number;
    public totalCost: number;
    public totalAddonCost: number;
    public netTotalCost: number;
    public ItemName: string;
    public itemNameCN: string;
    public itemID: string;
    public displayImage: string;
    public country: string;
    public state: string;
    public city: string;
    public area: string;
    public location: string;
    public companyCode: string;
    public branchCode: string;
    public companyName: string;
    public merchantID: number;

}

export class vOrderAddOn {
    public id: string;
    public orderDate: string;
    public orderNo: string;
    public paymentMethod: string;
    public fromHour: string;
    public toHour: string;
    public deliveryDate: string;
    public orderLine: string;
    public lineStatus: string;
    public country: string;
    public state: string;
    public city: string;
    public area: string;
    public location: string;
    public companyCode: string;
    public branchCode: string;
    public companyName: string;
    public merchantID: string;
    public optionCode: string;
    public optionStatus: string;
    public costWithGST: string;
    public priceWithGST: string;
    public quantity: string;
    public totalAddonAmount: string;
    public totalAddonCost: string;
    public optionName: string;
    public optionNameCN: string;
    public imageName: string;
}

export class OrderDetail
{
    public orderno:string;
    public addons:vOrderAddOn[];
    public items:vOrderItem[];
}

export class OrderLineStatus
{
    public id :number;
    public orderNo:string;
    public orderLine:number;
    public lineStatus:string;
    public reason:string;
}


export class SalesPivot
{
    public id:number;
    public orderDate:Date;
    public itemCode:string;
    public quantity: number;
    public totalCost: number;
    public totalAddonCost: number;
    public netTotalCost: number;
   
}