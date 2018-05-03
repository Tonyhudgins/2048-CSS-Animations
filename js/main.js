const PRESSED = 1;
const RELEASED = 0;

class Keyboard {
    constructor() {
        // Holds the current state of a given key
        this.keyStates = new Map();

        // Holds the callback functions for a key code
        this.keyMap = new Map();
    }

    addMapping(keyCode, callback) {
        this.keyMap.set(keyCode, callback);
    }

    handleEvent(event) {
        const {keyCode} = event;

        if (!this.keyMap.has(keyCode)) {
            // Did not have key mapped.
            return false;
        }

        event.preventDefault();

        const keyState = (event.type === 'keydown') ? PRESSED : RELEASED;

        if (this.keyStates.get(keyCode) === keyState) {
            // Already pressed. Blocks key repeating.
            return;
        }

        this.keyStates.set(keyCode, keyState);

        this.keyMap.get(keyCode)(keyState);
    }

    listenTo(window) {
        ['keydown', 'keyup'].forEach(eventName => {
            window.addEventListener(eventName, event => {
                this.handleEvent(event);
            });    
        });
    }
}    

class Scoreboard {
    constructor() {
        this.score = 0;
    }

    mapDisplay (scoreDiv, hiScoreDiv) {
        this.scoreDisplay = scoreDiv;
        this.hiScoreDisplay = hiScoreDiv;
    }

    setScore (val) {
//        console.log("setScore", val)
        this.score += val;
        this.scoreDisplay.innerHTML = this.score.toString();
        this.hiScoreDisplay.innerHTML = this.score.toString();
    }

    setHiScore (val) {
//        console.log("setHiScore", val)
        this.hiScoreDisplay.innerHTML = this.hiScore.toString();;
    }    
}

class Swipe {
    constructor(element) {
        this.xDown = null;
        this.yDown = null;
        this.element = element;

        this.element.addEventListener('touchstart', function(evt) {
            this.xDown = evt.touches[0].clientX;
            this.yDown = evt.touches[0].clientY;
        }.bind(this), false);
    }

    onLeft(callback) {
        this.onLeft = callback;

        return this;
    }

    onRight(callback) {
        this.onRight = callback;

        return this;
    }

    onUp(callback) {
        this.onUp = callback;

        return this;
    }

    onDown(callback) {
        this.onDown = callback;

        return this;
    }

    handleTouchMove(evt) {
        if ( ! this.xDown || ! this.yDown ) {
            return;
        }

        var xUp = evt.touches[0].clientX;
        var yUp = evt.touches[0].clientY;

        this.xDiff = this.xDown - xUp;
        this.yDiff = this.yDown - yUp;

        if ( Math.abs( this.xDiff ) > Math.abs( this.yDiff ) ) { // Most significant.
            if ( this.xDiff > 0 ) {
                this.onLeft();
            } else {
                this.onRight();
            }
        } else {
            if ( this.yDiff > 0 ) {
                this.onUp();
            } else {
                this.onDown();
            }
        }

        // Reset values.
        this.xDown = null;
        this.yDown = null;
    }

    run() {
        this.element.addEventListener('touchmove', function(evt) {
            this.handleTouchMove(evt).bind(this);
        }.bind(this), false);
    }
}


//(function () {
    const SPACE = 32;
    const UP    = 38;
    const DOWN  = 40;
    const LEFT  = 37;
    const RIGHT = 39;
    const H     = 72;
    const input = new Keyboard();

    const scores = new Scoreboard();
    scores.mapDisplay(document.getElementsByClassName("score")[0], document.getElementsByClassName("hi-score")[0])

    let tiles = document.getElementsByClassName("tiles")[0];

    [UP, DOWN, LEFT, RIGHT].forEach(keyName => {
        input.addMapping(keyName, keyState => {
            if (keyState) {
                tileData.collapse(keyName);
            } else {
//                console.log("key Release")
            }
        });    
    })
    input.addMapping(H, keyState => {
        if (keyState) {
            tileData.tileArray = tileData.tileHistory.pop();
            tiles.innerHTML = tileData.serialize();
            console.log("history");
        }
    })
    input.listenTo(window);

    var swiper = new Swipe(document.getElementsByClassName("game-container")[0]);
    swiper.onUp(function() { tileData.collapse(UP) });
    swiper.onDown(function() { tileData.collapse(DOWN) });
    swiper.onLeft(function() { tileData.collapse(LEFT) });
    swiper.onRight(function() { tileData.collapse(RIGHT) });
    swiper.run();
    
    // One-liner.
//    (new Swipe('#my-element')).onLeft(function() { alert('You swiped left.') }).run();
    
    

    const tileData = {

        tileArray: [
            0,0,0,0,
            0,0,0,0,
            0,0,0,0,
            0,0,0,0
        ],
/*
        tileArray: [
//            512, 2, 4, 4, 
            0,0,0,0,
            256, 4, 8, 2, 
            0, 2, 0, 0, 
            0, 0, 0, 0
        ],

        tileArray: [
//            4,16,2,8,
//            256,4,16,4,
            0,0,0,0,
            0,0,0,0,
            0,0,4,0,
            4,2,8,4
        ],

        tileArray: [
            128,2,128,16,
            32,256,8,0,
            4,16,32,4,
            4,0,0,0
        ],
*/
        tileHistory: [],

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
//                console.log("newTilePosition", newTilePosition)
                for (let i=0; i<=newTilePosition; j++){
                    if (this.tileArray[j] == 0) i++;
//                    console.log("i:j",i,j)
                }
                j--
                this.tileArray[j] = Math.random() > .5 ? 2 : 4;
                let e = document.createElement("DIV")
                let att = document.createAttribute("class");       // Create a "class" attribute
                let attValue = `tile tile-${this.tileArray[j].toString()} tile-${this.tileArray[j].toString()} tile-row${Math.floor(j/4)} tile-col${j%4}`;                           // Set the value of the class attribute
                att.value = attValue;
                e.setAttributeNode(att); 
                e.appendChild(document.createTextNode(this.tileArray[j].toString()))
    
                tiles.appendChild(e)
            }
            setTimeout(()=>{tiles.innerHTML=this.serialize();this.logTable()},500)
        },

        serialize: function () {
            let res = this.tileArray.reduce((acc, c, index) => {
                    return acc.concat((c>0)? `<div class="tile tile-${c.toString()} 
                            tile-row${Math.floor(index/4)} 
                            tile-col${index%4}">${c}</div>` 
                            : ``);
            }, "")
            return res;
        },

        collapse: function (direction) { //U,D,L,R
            const changeTileCol = function (t, from, to) {
                t.classList.remove(`tile-col${from}`)
                t.classList.add(`tile-col${to}`)
            }

            const changeTileRow = function (t, from, to) {
                t.classList.remove(`tile-row${from}`)
                t.classList.add(`tile-row${to}`)
            }

            const findRow = function (val) {
                return Math.floor(val/4)
            }

            const findCol = function (val) {
                return val%4
            }

            setTimeout(()=>{
                this.tileHistory.push([...this.tileArray]);
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

//                    console.log("col:",col, ", merged:",merged)
//                            console.log("col", col, "row", row)

                    if (ta[current] === 0) {                            //If unpopulated cell
                        if (newTilePos === -1) newTilePos = current
                        console.log("blank cell",newTilePos)

                    }else{                                              //If populated cell
//                        console.log("dir", dir, ", col", col)
                        if (col === ((dir===1)?0:3)) {                           //If first cell do nothing
                            console.log("first cell")
                        
                        }else if ( !merged && ta[current] === ta[previous] ) {   //If 2 matching tiles ajacent
                            changeTileCol(this.divIndex[current], col, col-dir)
                            ta[previous] *= 2
                            scores.setScore(ta[previous])
                            ta[current] = 0
                            newTilePos = current;
                            console.log("merge_cell", newTilePos)
                            merged = true;
                            moved = true;

                        }else if (
                            !merged && 
                            ta[previous] === 0 && 
                            (ta[current] === ta[newTilePos-dir]) && 
                            findRow(current) === findRow(newTilePos-dir) 
                        ) {  //If blank cell before
                            changeTileCol(this.divIndex[current], col, newTilePos%4-dir)
                            ta[newTilePos-dir] *= 2
                            scores.setScore(ta[newTilePos-dir])
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

                collapseCol = (col, row) => {
                    current = row*4+col
                    previous = current - dir
                    //newTilePos set each row
                    newMergePos = newTilePos - dir

//                    console.log("row:",row, ", merged:",merged)
                    if (ta[current] === 0) {                            //If unpopulated cell
                        if (newTilePos === -1) newTilePos = current
                        console.log("blank cell",newTilePos)

                    }else{                                              //If populated cell
//                        console.log("dir", dir, ", row", row)
                        if (row === ((dir>0)?0:3)) {                           //If first cell do nothing
                            console.log("first cell")
                        
                        }else if ( !merged && ta[current] === ta[previous] ) {   //If 2 matching tiles ajacent
                            changeTileRow(this.divIndex[current], row, row-dir/4)
                            ta[previous] *= 2
                            scores.setScore(ta[previous])
                            ta[current] = 0
                            newTilePos = current;
                            console.log("merge_cell", newTilePos)
                            merged = true;
                            moved = true;

                        }else if (
                            !merged && 
                            ta[previous] === 0 && 
                            ta[current] === ta[newTilePos-dir] && 
                            findCol(current) === findCol(newTilePos-dir)
                        ) {  //If blank cell before
                            changeTileRow(this.divIndex[current], row, findRow(newTilePos-dir))
                            ta[newTilePos-dir] *= 2
                            scores.setScore(ta[newTilePos-dir])
                            ta[current] = 0
                            // newTilePos stays the same
                            console.log("merge_cell_2", newTilePos)
                            merged = true;
                            moved = true;

                        }else if (newTilePos > -1) {                    //If blank cell before
                            console.log("move cell", newTilePos)
                            changeTileRow(this.divIndex[current], row, findRow(newTilePos))
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
                    case UP:
                    console.log("UP")
                    dir = 4;
                    for (let col=0; col<4; col++) {
                        newTilePos = -1;
                        merged = false;
                        for (let row=0; row<4; row++) {
                            collapseCol(col, row)
                        }
                    }
                    break;

                    case DOWN:
                    console.log("DOWN")
                    dir = -4;
                    for (let col=3; col>=0; col--) {
                        newTilePos = -1;
                        merged = false;
                        for (let row=3; row>=0; row--) {
                            collapseCol(col, row)
                        }
                    }
                    break;

                    case LEFT:
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

                    case RIGHT:
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

    tileData.addTile()
    tileData.addTile()
    
    tiles.innerHTML = tileData.serialize();

//}());