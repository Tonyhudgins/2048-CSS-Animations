//(function () {
    let tiles = document.getElementsByClassName("tiles")[0];

    const keyHandler = {
        ready: true
    }

    const tileData = {

        tileArray: [
            0,0,0,0,
            2,0,2,0,
            4,0,0,4,
            8,8,16,0
        ],

        logTable: function () {
            let t = this.tileArray;
            console.table([
                [ t[0], t[1], t[2], t[3] ],
                [ t[4], t[5], t[6], t[7] ],
                [ t[8], t[9], t[10],t[11]],
                [ t[12],t[13],t[14],t[15]]
            ])
        },

        addTile: function () {
            let zeroCount = this.tileArray.filter(c => c==0).length;
            if (zeroCount===0) {
                console.log("game over")
            }else{

                console.log(zeroCount)
                let newTilePosition = Math.round(Math.random()*(zeroCount-1))
                let j=0;
                console.log("newTilePosition", newTilePosition)
                for (let i=0; i<=newTilePosition; j++){
                    if (this.tileArray[j] == 0) i++;
                    console.log("i:j",i,j)
                }
                j--
                console.log(j)
                this.tileArray[j] = Math.random() > .5 ? 2 : 4;
                console.log(this.tileArray)
                let e = document.createElement("DIV")
                let att = document.createAttribute("class");       // Create a "class" attribute
                let attValue = `tile tile-row${Math.floor(j/4)} tile-col${j%4}`;                           // Set the value of the class attribute
                att.value = attValue;
                e.setAttributeNode(att); 
                e.appendChild(document.createTextNode(this.tileArray[j].toString()))
    
                tiles.appendChild(e)
               }
               setTimeout(()=>{tiles.innerHTML=this.serialize();this.logTable()},500)
        },

        serialize: function () {
            let res = this.tileArray.reduce((acc, c, index) => {
                    console.log(c)
                    return acc.concat((c>0)? `<div class="tile 
                            tile-row${Math.floor(index/4)} tile-col${index%4}">${c}</div>` : ``);
            }, "")
            return res;
        },

        collapse: function (direction) { //U,D,L,R
//            tiles.innerHTML = tileData.serialize();

            const changeTileCol = function (t, from, to) {
                t.classList.remove(`tile-col${from}`)
                t.classList.add(`tile-col${to}`)
            }
    
            setTimeout(()=>{
                let tileDisplayArray = tiles.getElementsByClassName("tile");
                let current = -1,
                    previous = -1,
                    newTilePos = -1,               //newTilePos set each row - blank tile
                    newMergePos = -1;              //newMergePos is ...
                let ta = this.tileArray;
                let merged = false;
                let moved = false;
                let dir;

                switch (direction) {
                    case "U":
                    break;

                    case "D":
                    break;

                    case "L":
                    console.log("LEFT")
                    dir = 1;
                    let i = 0;
                    for (let row=0; row<4; row++) {
                        newTilePos = -1;
                        merged = false;
                        for (let col=0; col<4; col++) {
                            current = row*4+col
                            previous = current - dir
                            //newTilePos set each row
                            newMergePos = newTilePos - dir


                            console.log("col:",col, ", merged:",merged)
                            if (ta[current] === 0) {                          //If unpopulated cell
                                if (newTilePos === -1) newTilePos = current

                                console.log("blank cell",newTilePos)
                            }else{                                              //If populated cell
                                if (col === 0) {                                //If first cell do nothing
                                    i++
                                    console.log("first cell")
                                
                                }else if ( !merged && ta[current] === ta[previous] ) {  //2 matching next to each other
                                    changeTileCol(tileDisplayArray[i], col, col-1)
                                    i++
                                    ta[previous] *= 2
                                    ta[current] = 0
                                    newTilePos = current;
                                    console.log("merge_cell", newTilePos)
                                    merged = true;
                                    moved = true;

                                }else if (!merged && ta[previous] === 0 && (ta[current] === ta[newTilePos-1]) ) {  //If blank cell before
                                    changeTileCol(tileDisplayArray[i], col, newTilePos%4-1)
                                    console.log(`tile-col${newTilePos%4-1} merged`)
                                    i++
                                    ta[newTilePos-1] *= 2
                                    console.log(`ta[newTilePos-1]`, newTilePos, newTilePos-1, ta[newTilePos-1])
                                    ta[current] = 0
                                    // newTilePos stays the same
                                    console.log("merge_cell_2", newTilePos)
                                    merged = true;
                                    moved = true;

                                }else if (newTilePos > -1) {                    //If blank cell before
                                    console.log("move cell", newTilePos)
                                    console.log("i", i)
                                    changeTileCol(tileDisplayArray[i], col, newTilePos%4)
                                    i++
                                    ta[newTilePos] = ta[current]
                                    ta[current] = 0
                                    newTilePos++;
                                    moved = true;
                                    merged = false;

                                }else{                                          //no move to make
                                    console.log("skip",newTilePos)
                                    i++
                                }                                                       
                            }
                        }
                    }
                    break;

                    case "R":
                    //    this.tileArray.map()
                    tileDisplayArray = tiles.getElementsByClassName("tile");
                    console.log(tileDisplayArray)
                    let v=[...tileDisplayArray].forEach((c,i,a)=>{
                        //c.classList.contains("tile-col3");
                        c.classList.add("tile-col3")
                    })            
                                
                    break;
                }

                if (moved) {
                    this.logTable();
                    setTimeout(()=>{tiles.innerHTML = this.serialize()}, 300)
                    setTimeout(()=>this.addTile(), 700);    
                }

            },200) //delay to allow the DOM to render
        }
    } 


    tiles.innerHTML = tileData.serialize();

//}());