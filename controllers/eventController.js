import EventModel from "../model/Event.js";
class EventController { 
    
    static addEvent = async (req, res) => { 
        
        try {
            console.log(req.user)
            const { _id } = req.user;
            const {eventName,startdate,enddate,startTime,endTime,location,description,category,bannerImage}=req.body
           
            
            const data = {
                userId:_id,
                eventName,
                startdate,
                enddate,
                startTime,
                endTime,
                location,
                description,
                category,
                bannerImage,
            }
             
            if (_id)
            {
                const doc=new EventModel(data)
                await doc.save() 
                res.send({"status":"success","message":"added successfully"})
            }   
        } catch (error) {
            res.status(400).send({"status":"failed","message":"All filds are required"})
        }
        
         
    }

    static eventList = async (req, res) => { 
        const { _id } = req.user;
        const list = await EventModel.find({ userId: _id })
        if (list)
        {
            res.send({list}) 
        }
        else {
            res.send({})  
        }
        
    }
}

export default EventController;