/**
 * 
 * @authors xipwang
 * @date    2016-11-07 15:10:12
 * @version $Id$
 */
(function($,wd,dc,undefined){
	//缓存单列
	//var selectItem;
	$.fn.selectItem = function(option){		
		function SelectItem(option,elements){
			//初始化
			this.init(option,elements);
		}
		//原型扩展
		$.extend(SelectItem.prototype,{
			 init:function(options,elements){ 
			 	var $this = this;
			 	$this.elements = elements;			 	
			 	$this.newH = 0;
			 	$this.options = {
			 		intervals:0,
			 		isSwiper:true,
			 		animate:100,
			 		isOpen:true,
			 	};
			 	$this.sizeli = $this.elements.find('ul').children();
			 	$this.sizeHeight = $this.sizeli.height();	
			 	$this.flag =true;
			 	$this.num = -1;   // 递增值为-1开始
			 	$this.moveH = 0;  // 参数为每次移动的递增的距离
			 	$this.startY = 0; // 保存第一次触发的Y坐标
        		$this.startX = 0; // 保存第一次触发的X坐标
			 	//合并配置参数
			 	$.extend(true,$this.options,options ||{});
                 //关闭事件
                $this.closeSelsect();
			 	//定位当前位置
			 	$this._setpostion($this.elements);
			 	//点击事件绑定
			 	$this._clickEvent();
			 	//拖动事件绑定
			 	$this._moveEvent($this.options.isSwiper)				 
			    return $this;
			 },
			 // 初始化菜单展开或者关闭
			_setpostion:function(ele){ 
			 		var $this =this;
			 		var option = $this.options;
				 	if(option.isOpen){
				 		ele.addClass('show');
				 		$this.num =$this.sizeli.length
				 		for(var i=0; i<$this.sizeli.length;i++){  
			 				$this.newH+=$this.sizeHeight+option.intervals;
			 				$($this.sizeli[i]).css({top:-$this.newH + 'px'}).show(200);
				 		}
				 	 }
			   },
			  closeSelsect:function(){
			  	var $this= this
			  	$('.close-select').on('click',function(){
			  		$this.elements.fadeOut(500);
			  		return false;	
			  	});
			  }, 
		     _clickEvent:function(elements){
			  		var $this =this;
			  		$this.elements.on('click',function(){
			  			var thisDom= $(this)
			  			if(thisDom.hasClass('show')){
			  				$this._hide(function(){
		  						$this.flag =true;
		  						thisDom.removeClass("show");
		  						return false;	
		  					});
			  			}else{
			  				$this._show(function(){
			  					$this.flag =true;			  					
			  					thisDom.addClass("show");
			  					return false;				  					
			  			    });
			  			}
			  		});
			  	  },
			 _show:function(callback){ //回调设置函授节流
			  	    var $this =this;
			  	    var option = $this.options;	
			  		if ($this.flag) { 
	                     $this.flag  = false;
	                     time1 = setInterval(function () { $this.num++;	                     
	                         $this.moveH  += $this.sizeHeight +option.intervals;	                         
	                         $this.sizeli.eq($this.num).css({top: -$this.moveH + "px"}).show()
	                         if ($this.num == $this.sizeli.length) { 
	                            	clearInterval(time1);
		                            if(typeof callback == 'function'){
		                            		callback();
		                            }
	                        	}
	                    },option.animate);
		              }
			      },
			 _hide:function(callback){
			   	 	var $this =this;
					if ($this.flag) {
	                     $this.flag  = false;
	                     time2 = setInterval(function () { $this.num--; 	                     	  
	                         $this.sizeli.eq($this.num).css({top:0 + "px"}).hide()
	                         if ($this.num ==0) { 
	                            	clearInterval(time2);
	                            	$this.moveH = 0;
	                            	$this.num =-1
		                            if(typeof callback == 'function'){
		                            		callback();
		                            }
	                        	}
	                    },option.animate);
		            }
			     },
			 _moveEvent:function(boll){ //事件绑定
			   		var  $this =this;
			   		var  dom = $this.elements; 
			   		var  flag = false;
			   		if(boll){
				   		dom.bind('touchstart',function(event){
				   			 flag = true;
			   			    var event = window.event || event;
			   			    var touchpros = event.touches[0]  || targetTouches[0]; 
			   			    dom.css({ transitionDuration: " inherit " });
	          			    $this.startY = touchpros.clientY - this.offsetTop;
	           			    $this.startX = touchpros.clientX - this.offsetLeft;	           			    
				   		}).bind('touchmove',function(event){
			   			  if (flag) {
		                        var event = window.event || event;
		   					    var touchpros = event.touches[0]  || targetTouches[0]; 
			                    var moveY = touchpros.clientY;
			                    var moveX = touchpros.clientX;
			                    var moinY = moveY - $this.startY;
			                    var moinX = moveX - $this.startX;
			                    if (moinX < 0) {  moinX = 0;
			                    } else if (moinX > $(window).width() - dom.width()) {
			                        moinX = $(window).width() - dom.width();
			                    };
			                    if (moinY < 0) { moinY = 0;			                       
			                    } else if (moinY > $(window).height() - dom.height() - 54) {
			                        moinY = $(window).height() - dom.height() - 54;
			                    };
			                    dom.css({  left: moinX + "px", top: moinY + "px"	 });
			        			return false;
			        	   };
				   		}).bind('touchend',function(){
						   	var midle = ($(window).width() - dom.width()) / 2;
			                var Leftof = dom.offset().left;
			                if (Leftof < midle) { moinX = 20;
			                    dom.css({ left: moinX + "px", transitionDuration: "0.4s" });
			                };
			                if (Leftof > midle) { moinX = $(window).width() - dom.width() - 20;
			                    dom.css({ left: moinX + "px", transitionDuration: "0.4s" });
			                };
			                flag = false;
				   		});
			   	 	}		
			    },
		  });
		// if(typeof selectItem == 'undefined'){    
		// 	  selectItem = new SelectItem(option,$(this));			
		//   }
		//   return selectItem; 
		 return	  new SelectItem(option,$(this));	
	}
})(jQuery,window,document)