//(function () {
    let tiles = document.getElementsByClassName("tiles")[0];

    const keyHandler = {
        ready: true
    }

    const tileData = {

        tileArray: [
            0,0,2,0,
            2,0,2,0,
            4,0,0,4,
            8,8,16,0
        ],

        tileArray: [
            0,0,0,0,
            0,0,2,0,
            0,0,0,0,
            8,0,0,0
        ],

        divIndex: [],

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
                let newTilePosition = Math.round(Math.random()*(zeroCount-1))
                let j=0;
                console.log("newTilePosition", newTilePosition)
                for (let i=0; i<=newTilePosition; j++){
                    if (this.tileArray[j] == 0) i++;
                    console.log("i:j",i,j)
                }
                j--
                this.tileArray[j] = Math.random() > .5 ? 2 : 4;
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
                    return acc.concat((c>0)? `<div class="tile 
                            tile-row${Math.floor(index/4)} 
                            tile-col${index%4}">${c}</div>` 
                            : ``);
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
                let n=-1;
                this.divIndex = this.tileArray.map(c => {
                    let res;
                    if(c>0){
                        n++
                        res = tileDisplayArray[n]
                    }else{
                        res = null
                    }
                    return res
                })
//                console.log("divIndex", this.divIndex)
                let current = -1,
                    previous = -1,
                    newTilePos = -1,               //newTilePos set each row - blank tile
                    newMergePos = -1;              //newMergePos is ...
                let ta = this.tileArray;
                let merged = false;
                let moved = false;
                let dir;

                collapseRow = (col, row) => {
                    current = row*4+col
                    previous = current - dir
                    //newTilePos set each row
                    newMergePos = newTilePos - dir

                    console.log("col:",col, ", merged:",merged)
                    if (ta[current] === 0) {                          //If unpopulated cell
                        if (newTilePos === -1) newTilePos = current
                        console.log("blank cell",newTilePos)

                    }else{                                              //If populated cell
                        console.log("dir", dir, ", col", col)
//                        console.log((dir===1)?0:3)
                        if (col === ((dir===1)?0:3)) {                                //If first cell do nothing
                            console.log("first cell")
                        
                        }else if ( !merged && ta[current] === ta[previous] ) {  //2 matching next to each other
                            changeTileCol(this.divIndex[current], col, col-dir)
                            ta[previous] *= 2
                            ta[current] = 0
                            newTilePos = current;
                            console.log("merge_cell", newTilePos)
                            merged = true;
                            moved = true;

                        }else if (!merged && ta[previous] === 0 && (ta[current] === ta[newTilePos-dir]) ) {  //If blank cell before
                            changeTileCol(this.divIndex[current], col, newTilePos%4-dir)
                //                                    console.log(`tile-col${newTilePos%4-dir} merged`)
                            ta[newTilePos-dir] *= 2
                //                                    console.log(`ta[newTilePos-1]`, newTilePos, newTilePos-dir, ta[newTilePos-dir])
                            ta[current] = 0
                            // newTilePos stays the same
                            console.log("merge_cell_2", newTilePos)
                            merged = true;
                            moved = true;

                        }else if (newTilePos > -1) {                    //If blank cell before
                            console.log("move cell", newTilePos)
                            changeTileCol(this.divIndex[current], col, newTilePos%4)
                            ta[newTilePos] = ta[current]
                            ta[current] = 0
                            newTilePos = newTilePos + dir;
                            moved = true;
                            merged = false;

                        }else{                                          //no move to make
                            console.log("skip",newTilePos)
                        }                                                       
                    }
                }

                switch (direction) {
                    case "U":
                    break;

                    case "D":
                    break;

                    case "L":
                    console.log("LEFT")
                    dir = 1;
                    for (let row=0; row<4; row++) {
                        newTilePos = -1;
                        merged = false;
                        for (let col=0; col<4; col++) {
                            collapseRow(col, row)
                        }
                    }
                    break;

                    case "R":
                    console.log("RIGHT")
                    dir = -1;
                    for (let row=3; row>=0; row--) {
                        newTilePos = -1;
                        merged = false;
                        for (let col=3; col>=0; col--) {
                            collapseRow(col, row)
                        }
                    }
                    break;
                }

                if (moved) {
                    this.logTable();
                    setTimeout(()=>{tiles.innerHTML = this.serialize()}, 300)
                    setTimeout(()=>this.addTile(), 500);    
                }

            },200) //delay to allow the DOM to render
        }
    } 


    tiles.innerHTML = tileData.serialize();

//}());