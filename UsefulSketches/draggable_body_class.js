////////// You Can Use This Class In A Separate File //////////


class Draggable_Body {
  constructor(input_x, input_y, input_vx, input_vy, input_mass, input_colorr, input_diameter) {

    this.dragging = false; // The object is not being dragged by default.
    this.rollover = false; // The mouse is not over the object by default.


    this.position_vector = createVector(input_x, input_y);
    this.velocity_vector = createVector(input_vx, input_vy);
    
    this.mass = input_mass; // Mass definition.
    
    this.diameter = input_diameter; // Diameter definition, may be changed to a slider later on.
    
    this.colorr = input_colorr; // Color definition.
    
  }

  over() {
    // Check if the mouse is on the object.
    if (mouseX > this.position_vector.x && mouseX < this.position_vector.x + this.diameter && mouseY > this.position_vector.y && mouseY < this.position_vector.y + this.diameter) {
      this.rollover = true;
    } else {
      this.rollover = false;
    }

  }

  update() {
    // Adjust the position when the objects are being dragged.
    if (this.dragging) {
      this.position_vector.x = mouseX + this.offsetX;
      this.position_vector.y = mouseY + this.offsetY;
    }

  }

  show() {

    noStroke();
    // Different colors are given to the objects based on their state.
    if (this.dragging) {
      fill(0);
    } else if (this.rollover) {
      fill(100);
    } else {
      fill(this.colorr, 200);
    }
    circle(this.position_vector.x, this.position_vector.y, this.diameter);
  }

  pressed() {
    // Check if the object is clicked on.
    if (mouseX > this.position_vector.x && mouseX < this.position_vector.x + this.diameter && mouseY > this.position_vector.y && mouseY < this.position_vector.y + this.diameter) {
      this.dragging = true;
      // If so, keep track of relative location of click.
      this.offsetX = this.position_vector.x - mouseX;
      this.offsetY = this.position_vector.y - mouseY;
    }
  }

  released() {
    // The function to release the objects after they have been dragged.
    this.dragging = false;
  }
  
  
  // The function to make the object bounce off the edges. Simple arithmetic going on.
  edge_bounce() {
    
    if (this.position_vector.y >= height - this.diameter / 2) {
      this.position_vector.y = height - this.diameter / 2;
      this.velocity_vector.y = this.velocity_vector.y * (-1);
    }
    else if (this.position_vector.y <= 0 + this.diameter / 2) {
      this.position_vector.y = 0 + this.diameter / 2;
      this.velocity_vector.y = this.velocity_vector.y * (-1);
    }
    else if (this.position_vector.x <= 0 + this.diameter / 2) {
      this.position_vector.x = 0 + this.diameter / 2;
      this.velocity_vector.x = this.velocity_vector.x * (-1);   
    }
    else if (this.position_vector.x >= width - this.diameter / 2) {
      this.position_vector.x = width - this.diameter / 2;
      this.velocity_vector.x = this.velocity_vector.x * (-1);   
    }
  }
}


////////// The Functions Below This Comment Belongs to The Main Sketch //////////


function mousePressed() {
  draggable_body_1.pressed();
  draggable_body_2.pressed();
}



function mouseReleased() {
  // Quit dragging
  draggable_body_1.released();
  draggable_body_2.released();
}


