
  function addToCart(proId){

     $.ajax({
         url:'/add-to-cart/'+proId,
         method:'get',
         success:(response)=>{

            if(response.status)
            {
                let count=$('#cart-count').html()
                count=response.cartCount
                $('#cart-count').html(count)

            }
              
         }
     })


  }
