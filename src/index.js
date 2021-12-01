const $=document.querySelector.bind(document);  
const $$ = document.querySelectorAll.bind(document); 
var play = $('.play'); // get button play
var pause = $('.pause')// get button pause
var numberCurrentSong =$('#currenSong');
var totalSong = $('#totalSong');
var cdThumb = $('.cd-thumb'); // get style cd
var cdWidth = cdThumb.offsetWidth;
var nameSong = $('.name');
var audio = $('#audio');
var progress = $('.progress');
var nextSong = $('.next');
var prevSong = $('.prev');
var cycle = $('.cycle');
var random = $('.random');
var playlist = $('.playlist');

const app = {
    isStateCycle:false,
    isStateRandom:false,
    currentIndex:0,
    songs : [
        {
            name:'Cry On My Shoulder',
            singer:'SuperStars',
            path:'../public/music/CryOnMyShoulder-SuperStars-152828.mp3',
            image:'../public/img/cryon.jpg',
        },
        { 
            name:'Forever',
            singer:'MariahCarey',
            path:'/public/music/Forever_MariahCarey_3p4.mp3',
            image:'/public/img/forever.png',
        },
        {
            name:'Im Yours',
            singer:'Princess',
            path:'/public/music/ImYours-Princess_4e4nr.mp3',
            image:'/public/img/im-your-princess-princess.png',
        },
        {
            name:'Stay',
            singer:'ZeddAlessiaCara',
            path:'/public/music/Stay-ZeddAlessiaCara-5373541.mp3',
            image:'/public/img/stay_zed.jpg',
        },
        {
            name:'The Ocean',
            singer:'MikePerryShyMartin',
            path:'/public/music/TheOcean-MikePerryShyMartin-4492404.mp3',
            image:'/public/img/the_ocean.jpg',
        },
        {
            name:'Until You',
            singer:'ShayneWard',
            path:'/public/music/UntilYou-ShayneWard-1979790.mp3',
            image:'/public/img/untilYou.jpg',
        },
        {
            name:'Why Not Me',
            singer:'Enriquelglesias',
            path:'/public/music/WhyNotMe-EnriqueIglesias-3479372.mp3',
            image:'/public/img/whynotme.jpg',
        },
    ],
    loadSong: function(currentIndex)
    {
        nameSong.innerHTML = this.songs[currentIndex].name;
        cdThumb.src = this.songs[currentIndex].image; 
        audio.src =this.songs[currentIndex].path;
        audio.play;
        numberCurrentSong.innerHTML = currentIndex + 1;
        totalSong.innerHTML = this.songs.length;
    },  
    render : function ()
    {
        const htmls = this.songs.map((song,index) =>{
            return `
            <div class="sing__frame ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="sing__frame-info">
                    <div class="sing__info" style="background-image:url('${song.image}' );"></div>
                    <div class="sing__name">
                        <h3 class="sing__name-info">${song.name}</h3>
                        <p class="sing_name-group">${song.singer}</p>
                    </div>
                </div>
                <div class="sing__frame-icon">
                    <i class="fas fa-ellipsis-h"></i> 

                    <div class = "content-icon">Chưa làm</div> 
                </div>
             </div>
            `
        })
        playlist.innerHTML = htmls.join(''); 
    },

    handleEvents : function()
    {
        const _this= this;
        // handle cd thumb
            // document.onscroll = function()
            // {
            //     var scrollTop = window.scrollY || document.documentElement.scrollTop ;
            //     var newCdWidth = cdWidth - scrollTop;
            //     cdThumb.style.width = newCdWidth > 0 ? newCdWidth + 'px':0;
            //     cdThumb.style.height = newCdWidth > 0 ? newCdWidth + 'px':0;
            //     cdThumb.style.opacity = newCdWidth/cdWidth ;

            // }
        //cd route
        const cdThumbAnimate = cdThumb.animate([
                {transform: 'rotate(360deg)'}],
                {
                    duration: 10000,
                    iterations: Infinity,
                });
        cdThumbAnimate.pause();
        // controll play
        play.onclick = function()
        {
          
           audio.play();
        
        }
        audio.onplay=function()
        {
            play.style.display = "none";
            pause.style.display = "block"; 
            cdThumbAnimate.play();
        }
         // controll pause
        pause.onclick = function()
        {
           audio.pause();
           
        }
        audio.onpause=function()
        {
            play.style.display = "block";
            pause.style.display = "none";
            cdThumbAnimate.pause();
        }
        // progress time
        audio.ontimeupdate = function()
        {
            
            const currentProgress = Math.floor((audio.currentTime/audio.duration)*100);
            if(currentProgress)
            {
                progress.value = currentProgress;   
            }
            else
            {
                progress.value = 0; 
            }
        }
        // progress onchane
        progress.onchange= function()
        {
            const timeSeek = ((progress.value*audio.duration)/100);
            audio.currentTime = timeSeek;
        }
        // end song next song
        audio.onended = function()
        {
            if(_this.isStateCycle)
            {
                audio.play();
            }
            else
            {
                _this.next();
                audio.play(); 
            }
        }
        // next song
        nextSong.onclick =function()
        {
            nextSong.classList.add('active');
            setTimeout(() => {
            nextSong.classList.remove('active');  
            },400);
            _this.next();
            audio.play();
            _this.render();   
            _this.scrollToActiveSong();  
     
        }
        //prev song
        prevSong.onclick =function()
        {
            prevSong.classList.add('active');
            setTimeout(() => {
            prevSong.classList.remove('active');  
            },400);
            _this.prev();
            audio.play();
            _this.render();    
            _this.scrollToActiveSong();
          
        }
        // handle lặp 
        cycle.onclick = function()
        {
            _this.isStateCycle = !_this.isStateCycle;
            cycle.classList.toggle('active');
        }
        // phat random
        random.onclick = function()
        {
            _this.isStateRandom = !_this.isStateRandom;
            random.classList.toggle('active');
        }
        // lang nghe click vao playlist
        playlist.onclick = function(e)
        {
            const songNode = e.target.closest('.sing__frame:not(.active)');
            const iconNode = e.target.closest('.sing__frame-icon');
            //e.target.closest neu khong co thang con thi lay thang cha
            if( songNode ||  iconNode)
            {
                //handle click bai hat
                if(songNode && !iconNode)
                {
                    // console.log(songNode.getAttribute('data-index')) 1 cach
                    // console.log(songNode.dataset.index); cach 2
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadSong(_this.currentIndex);
                    _this.render();
                    audio.play();
                }
                if(iconNode)
                {
                   
                }
            }

        }
    },
    next : function()
    {
        if(this.isStateRandom)
        {
            this.currentIndex = Math.floor(Math.random()*(this.songs.length - 1));
            this.loadSong(this.currentIndex);
        }
        else
        {
            this.currentIndex++;
            if(this.currentIndex >= this.songs.length)
            {
                this.currentIndex = 0;
            }
            this.loadSong(this.currentIndex);
        }
    },
    prev : function()
    {
        if(this.isStateRandom)
        {
            this.currentIndex = Math.floor(Math.random()*(this.songs.length - 1));
            this.loadSong(this.currentIndex);
        }
        else
        {
            this.currentIndex--;
            if(this.currentIndex< 0)
            {
                this.currentIndex = this.songs.length - 1;
            }
            this.loadSong(this.currentIndex);   
        }
    }
    ,
    scrollToActiveSong: function()
    {
        setTimeout(() => {
            $('.sing__frame.active').scrollIntoView({behavior: "smooth",block: "end", inline: "start"});
        }, 500);
    }
    ,
    start : function()
    {
        this.render();
        this.handleEvents();
        this.loadSong(this.currentIndex);
    }
}
app.start();

