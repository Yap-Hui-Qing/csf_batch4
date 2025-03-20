package vttp.batch4.csf.ecommerce.repositories;

import java.sql.SQLException;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import vttp.batch4.csf.ecommerce.models.Cart;
import vttp.batch4.csf.ecommerce.models.LineItem;
import vttp.batch4.csf.ecommerce.models.Order;

@Repository
public class PurchaseOrderRepository {

  @Autowired
  private JdbcTemplate template;

  public static final String INSERT_ORDER = """
      insert into userOrder (order_id, customer_name, address, priority, comments) values (?, ?, ?, ?, ?);
      """;
  public static final String INSERT_CART_ITEMS = """
      insert into cart (prodId, quantity, product_name, price, order_id) values (?, ?, ?, ?, ?);
      """;

  // IMPORTANT: DO NOT MODIFY THIS METHOD.
  // If this method is changed, any assessment task relying on this method will
  // not be marked
  // You may only add Exception to the method's signature
  public void create(Order order) {
    // TODO Task 3
    insertOrder(order);

  }

  public void insertOrder(Order order) {
    template.update(INSERT_ORDER, 
      order.getOrderId(), order.getName(), order.getAddress(), order.getPriority(), order.getComments()
    );
  }

  public void insertCart(Order order) {
    Cart cart = order.getCart();
    System.out.println(cart);
    List<LineItem> lineItems = cart.getLineItems();
    List<Object[]> items = lineItems.stream()
      .map(li -> {
        Object[] fields = new Object[5];
        fields[0] = li.getProductId();
        fields[1] = li.getQuantity();
        fields[2] = li.getName();
        fields[3] = li.getPrice();
        fields[4] = order.getOrderId();
        return fields;
      }).toList();
    template.batchUpdate(INSERT_CART_ITEMS, items);
  }
}
