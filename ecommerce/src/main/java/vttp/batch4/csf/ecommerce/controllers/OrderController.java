package vttp.batch4.csf.ecommerce.controllers;

import java.io.StringReader;
import java.util.LinkedList;
import java.util.List;
import java.util.logging.Logger;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import vttp.batch4.csf.ecommerce.models.Cart;
import vttp.batch4.csf.ecommerce.models.LineItem;
import vttp.batch4.csf.ecommerce.models.Order;
import vttp.batch4.csf.ecommerce.services.PurchaseOrderService;

@Controller
@RequestMapping("/api")
public class OrderController {

  private static final Logger logger = Logger.getLogger(OrderController.class.getName());

  @Autowired
  private PurchaseOrderService poSvc;

  // IMPORTANT: DO NOT MODIFY THIS METHOD.
  // If this method is changed, any assessment task relying on this method will
  // not be marked
  @PostMapping("/order")
  public ResponseEntity<String> postOrder(@RequestBody String order) {

    // TODO Task 3
    
    System.out.println(order);
    // convert to Order
    JsonReader reader = Json.createReader(new StringReader(order));
    JsonObject j = reader.readObject();
    
    Cart c = new Cart();
    List<LineItem> items = new LinkedList<>();
    JsonObject cart = j.getJsonObject("cart");
    JsonArray li = cart.getJsonArray("lineItems");
    for (int i = 0; i < li.size(); i++){
      JsonObject obj = li.getJsonObject(i);
      LineItem it = new LineItem();
      it.setProductId(obj.getString("prodId"));
      it.setName(obj.getString("name"));
      it.setPrice( (float) obj.getJsonNumber("price").doubleValue());
      it.setQuantity(obj.getInt("quantity"));
      items.add(it);
    }
    c.setLineItems(items);

    Order o = new Order();
    o.setName(j.getString("name"));
    o.setAddress(j.getString("address"));
    o.setPriority(j.getBoolean("priority"));
    o.setComments(j.getString("comments"));
    o.setCart(c);

    System.out.println(o);

    try{
      poSvc.createNewPurchaseOrder(o);
      JsonObject obj = Json.createObjectBuilder()
        .add("orderId", o.getOrderId())
        .build();
      logger.info("order created successfully");
      return ResponseEntity.ok(obj.toString());
    } catch (Exception ex){
      JsonObject obj = Json.createObjectBuilder()
        .add("message", ex.getMessage())
        .build();
      logger.info("failed to create order");
      logger.info(ex.getMessage());
      return ResponseEntity.status(400).body(obj.toString());
    }
  }
}
