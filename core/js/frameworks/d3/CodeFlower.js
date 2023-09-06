var distancia;
var oldDistance;
var stopCodeFlower=null;
var fric = 0.3;
var CodeFlower = function(selector, w, h,distance) {
  this.w = w;
  this.h = h;
  this.distance = distance;
  
  distancia = distance;
  oldDistance = distance;
  d3.select(selector).selectAll("svg").remove();

  this.svg = d3.select(selector).append("svg:svg")
    .attr('width', w)
    .attr('height', h);

  this.svg.append("svg:rect")
    //.style("stroke", "#999")
    .style("fill", "transparent")
    .attr('width', w)
    .attr('height', h);
    
  this.force = d3.layout.force()
    .on("tick", this.tick.bind(this))
    .charge(function(d) { return d._children ? -d.size / 100 : -40; })
    .linkDistance(function(d) {
      return distancia;
    })
    .size([h, w]);
};

var getNumberFormated = function(nStr){
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    //alert('antes');
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}
var getSize = function(v){
  var size = 7;
  if((v>1)&&(v<=10)){
    size = 9;
  }
  if((v>10)&&(v<=20)){
    size = 9.5;
  }
  if((v>20)&&(v<=30)){
    size = 10;
  }
  if((v>30)&&(v<=40)){
    size = 10.5;
  }
  if((v>40)&&(v<=50)){
    size = 11;
  }
  if((v>50)&&(v<=60)){
    size = 11.5;
  }
  if((v>60)&&(v<=70)){
    size = 12;
  }
  if((v>70)&&(v<=80)){
    size = 12.5;
  }
  if((v>80)&&(v<=90)){
    size = 13;
  }
  if((v>90)&&(v<=100)){
    size = 13.5;
  }
  if((v>100)&&(v<=110)){
    size = 14;
  }
  if((v>110)&&(v<=120)){
    size = 15.5;
  }
  if((v>120)&&(v<=130)){
    size = 16;
  }
  if((v>130)&&(v<=140)){
    size = 16.5;
  }
  if((v>140)&&(v<=150)){
    size = 17;
  }
  if((v>150)&&(v<=160)){
    size = 17.5;
  }
  if((v>160)&&(v<100000)){
    size = 19;
  }
  if((v>100000)&&(v<1000000)){
    size = 20;
  }
  if(v>100000){
    size = 24;
  }
  return size;
}
CodeFlower.prototype.update = function(json) {
  if (json) this.json = json;

  this.json.fixed = true;
  this.json.x = this.w / 2;
  this.json.y = this.h / 2;

  var nodes = this.flatten(this.json);
  var links = d3.layout.tree().links(nodes);
  var total = nodes.length || 1;

  // remove existing text (will readd it afterwards to be sure it's on top)
  this.svg.selectAll("text").remove();

  // Restart the force layout
  
  this.force
    .gravity(Math.atan(total / 50) / Math.PI * 0.4)
    //.friction(fric)
    .nodes(nodes)
    .links(links)
    .start();
    
    var obj = this.force;
    setTimeout(function(){
      obj.friction(0.85);
      
    },200);
    
    
  // Update the links
  this.link = this.svg.selectAll("line.link")
    .data(links, function(d) { return d.target.name; });

  // Enter any new links
  
  this.link.enter().insert("svg:line", ".node")
    .attr("class", "link")
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; })
    .attr("stroke-dasharray","5,2")
    .style("stroke",function(d){return d.target.color})

  // Exit any old links.
  this.link.exit().remove();

  // Update the nodes
  
  this.node = this.svg.selectAll("circle.node")
    .data(nodes, function(d) { return d.name; })
    .classed("collapsed", function(d) { return d._children ? 1 : 0; })
  
  this.node.transition()
    .attr("r", function(d) {
      //return d.children ? 3.5 : Math.pow(d.size, 2/5) || 1;
      return getSize(d.size);
      });

  // Enter any new nodes
  this.node.enter().append('svg:circle')
    .attr("class", "node")
    .attr("id",function(d){return 'cluster_'+d.id})
    .classed('directory', function(d) { return (d._children || d.children) ? 1 : 0; })
    .attr("r", function(d) {
      //return d.children ? 3.5 : Math.pow(d.size, 2/5) || 1;
      return getSize(d.size);
    })
    .style("fill", function color(d) {
      return d.color;
    })
    .call(this.force.drag)
    .on("click", this.click.bind(this))
    .on("mouseover", this.mouseover.bind(this))
    .on("mouseout", this.mouseout.bind(this))

  // Exit any old nodes
  this.node.exit().remove();
  
  this.text = this.svg.append('svg:text')
    .attr('class', 'nodetext')
    .attr('dy', 0)
    .attr('dx', 0)
    .attr('text-anchor', 'middle');
  
  
  this.labels = this.svg.selectAll(".nodeCount")
    .data(nodes, function(i) { return i; })
    .enter()
    .append("svg:text")
      .attr("class","nodeCount")
      .text(function(i){
        var r='';
        var isFirstNodes = MDM6('isFirstNodes');
  
        if(isFirstNodes){
          i.mainSector = true;
        }
        if(i.mainSector){
          r=i.size;
        }else{
          if(i.size>1){
            r=i.size;
          }
        }
        
        r = getNumberFormated(r);
        return r;
      })
      .attr("text-anchor","middle")
      .call(this.force.drag)

  //return this;
};

CodeFlower.prototype.flatten = function(root) {
  var nodes = [], i = 0;

  function recurse(node) {
    if (node.children) {
      node.size = node.children.reduce(function(p, v) {
        return p + recurse(v);
      }, 0);
    }
    if (!node.id) node.id = ++i;
    nodes.push(node);
    return node.size;
  }

  root.size = recurse(root);
  return nodes;
};

CodeFlower.prototype.click = function(d) {
  // Toggle children on click.
  fric = 0.9;
  //distancia = oldDistance/2;
  
  if (d.children) {
   // distancia = oldDistance/2;
    fric = 0;
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  var status = ''
  if((d._children!=undefined)||(d.children!=undefined)){
    //console.log('update');
    //fric = 0;
    this.update();
   
  }
  if((typeof d.children === "undefined")&&(d.size>1)){
    //console.log('actualizando');
    var getMoreLevels = MDM6('moreLevesCluster');
    if((getMoreLevels)||(d.size<=50)){
      MDM6('updateCluster',d);
    }
  }
  if(d.size==1){
    MDM6('showRecordCard',{id:d.id,color:d.color});
  }else{
    if(d.name!='root'){
        fric = 0;
        if(d.children){
          MDM6('updateDetailCluster',d.children,d.name);
        }
        if(d._children){
          MDM6('destroyDetailCluster');
        }
        if((d.children)||(d._children)){
          MDM6('compactCluster',d.children,d);
        }
    }else{
      fric = 0.9;
      MDM6('setClearItems',true);
      MDM6('clearClusters');
      setTimeout(function(){
        MDM6('hideLabelCluster',d);
      },1000)
      
    }
  }
  
};

CodeFlower.prototype.mouseover = function(d) {
  /*
  this.text.attr('transform', 'translate(' + d.x + ',' + (d.y - 5 - (d.children ? d.size : Math.sqrt(d.size) / 2)) + ')')
    .text(d.name)//texto hover cada nodo
    .style('display', null);
    */
  //if(d.size==1){
  //if(d.name!='root'){
    MDM6('showLabelCluster',d);
  //}
  //}
};

CodeFlower.prototype.mouseout = function(d) {
  /*
  this.text.style('display', 'none');
  */
  MDM6('hideLabelCluster',d);
};

CodeFlower.prototype.tick = function() {
  var h = this.h;
  var w = this.w;
  this.link.attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

  this.node.attr("transform", function(d) {
    return "translate(" + Math.max(5, Math.min(w - 5, d.x)) + "," + Math.max(5, Math.min(h - 5, d.y)) + ")";
  });
  this.labels
    .attr("dy","0")
    .style('display', null)
    .attr("dx","0")
    .attr("transform", function(d) {
      return "translate(" + d.x + ',' + (d.y+3)+ ")";
    })
    .on("click", this.click.bind(this))
    .on("mouseover", this.mouseover.bind(this))
    .on("mouseout", this.mouseout.bind(this))
};

CodeFlower.prototype.cleanup = function() {
  this.update([]);
  this.force.stop();
};