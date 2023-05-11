import Product from "../model/Product.js";
import CheckoutModel from "../model/Checkout.js";
class ProductController { 
    //list products
    static productList = async (req, res) => { 
        const list = await Product.find()
        if (list)
        {
            res.send({list}) 
        }
        else {
            res.send({})  
        }  
    }
    //product details
    static productDetails = async (req, res) => { 
        const id = req.query.id;
        
        const data = await Product.find({_id:id})
        if (data)
        {
            res.send({data}) 
        }
        else {
            res.send({})  
        }  
    }
    // add checkout
    static addCheckout = async (req, res) => { 
        try {
            var { userId, ProductId } = req.query;
            console.log("userId===>",userId)
            const list = await CheckoutModel.find({ userid: userId, paid: false })
            console.log("list1",list)
            if (list.length>0)
            {
               //login if product is already added or not
               const bascketData = await CheckoutModel.find({ userid: userId, lists: ProductId,paid: false}, { lists: 1 })
               console.log(bascketData)
                if (bascketData.length > 0)
                {
                    res.status(400).json({ message: 'Product already added'});       
                }
                else {
                    const data = await CheckoutModel.updateOne(
                        { userid: userId,paid: false},
                        { $push: { lists: ProductId } }
                    );
                    
                    if (data.acknowledged)
                    {
                        res.status(200).json({ message: 'Product added successfully'});   
                    }
                    else {
                        res.status(200).json({ message: 'Product added successfully'});   
                    }   
                }
            }
    
            else {
                try {
                    console.log("ProductId", ProductId)
                    
                    const doc = new CheckoutModel({
                        userid: userId,
                        paid: false,
                        list: [ProductId]
                      });
                      
                      doc.save()
                          .then(async (data)=> {
                              
                            const info = await CheckoutModel.updateOne(
                                { userid: userId,paid: false},
                                { $push: { lists: ProductId } }
                              );
                              if (info.acknowledged)
                              {
                                  res.status(200).json({ message: 'Product Added successfully' });    
                              }
                              else {
                                res.status(400).json({ message: 'Something went wrong'});  
                              }
                        })
                        .catch((error) => {
                            console.log('Document saving failed:', error);
                            res.status(400).json({ message: 'Something went wrong'}); 
                        });
       
                } catch (error) {
                    console.log("error===>",error)
                    res.status(400).json({ message: 'Something went wrong'});  
                }  
            }   
        } catch (error) {
            console.log(error)
            res.status(400).json({ message: 'Something went wrong'});  
        }
        


        
    }

     //delete checkout
     static removeCheckout = async (req, res) => { 
         const { userId, ProductId} = req.query;
         const list = await CheckoutModel.find({ userid: userId, paid: false })
         
         
        if (list.length>0)
        {
           
            const data = await CheckoutModel.updateOne(
                { userid: userId,paid: false},
                { $pull: { lists: ProductId} }
            );
            console.log("pull data==>",data)
            const list1 = await CheckoutModel.find({ userid: userId, paid: false })

            console.log("new pull data==>",list1)

            if (data.acknowledged)
            {
                res.status(200).json({ message: 'Product Removed successfully '});   
            }
            else {
                res.status(400).json({ message: 'Product Removed successfully'});   
            }

        }

        else {
            res.status(400).json({ message: 'Something went wrong'});   
     
        }


        
    }
    
    //get checkout list 
    static listCheckout = async (req, res) => { 
        try {
            const { userId } = req.query;
            console.log("userId====>", userId)
            const list = await CheckoutModel.find({ userid: userId, paid: false })
            if (list.length > 0)
            {
    
                const ids = list[0].lists
                const data = await Product.find({ _id: { $in: ids } });
                let Total = 0
                let ItemCount=0
                for (let i = 0; i < data.length; i++)
                {
                    ItemCount=ItemCount+1
                    Total=Total+(Number(data[i].listPrice))
                }

                
    
              
                res.status(200).json({
                    message: 'Product loaded successfully', data: {
                   data,Total,checkoutId:list[0]._id,ItemCount
              }});  
            }
            else
            {
                res.status(200).json({
                    message: 'No data', data:[]});   
            }   
        } catch (error) {
            console.log(error)
            res.status(400).json({ message: 'Something went wrong'});      
        }

       
    }
}

export default ProductController;