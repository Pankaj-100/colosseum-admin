import React from 'react';

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { Image } from 'antd';


// React Responsive Carousel ---

   
   function Gallery({images}) {
     return (
        <Carousel width={400} >
            {
                images?.map((image)=>{
                    return <div style={{borderRadius:'5px'}}>
                    <img   style={{borderRadius:'5px'}} src={image} />
                    {/* <p className="legend">Legend 1</p> */}
                </div>
                })
            }
        
        
    </Carousel>

     )
   }
   
   export default Gallery
        


