package com.example.backend.serviceImpl;

import com.example.backend.model.Notification;
import com.example.backend.model.Product;
import com.example.backend.pattern.ObserverPattern.EmailNotifier;
import com.example.backend.pattern.ObserverPattern.LogNotifier;
import com.example.backend.pattern.ObserverPattern.ProductExpiryNotifier;
import com.example.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
@Service
public class NotificationService implements com.example.backend.service.NotificationService {
    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<String> notifyProductExpiry() {
        Date now = new Date();
        List<String> notifications = new ArrayList<>();
        // Tính ngày sau 5 ngày
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(now);
        calendar.add(Calendar.DAY_OF_MONTH, 20);
        Date fiveDaysLater = calendar.getTime();
        List<Product> products = productRepository.findProductsExpiringWithin(now, fiveDaysLater);

        //observer pattern
        ProductExpiryNotifier notifier = new ProductExpiryNotifier();
        notifier.addObserver(new EmailNotifier());
        notifier.addObserver(new LogNotifier());

        for(Product i : products){
            Notification notification = new Notification();
            notification.setMessage("Sản phẩm " + i.getProductName() + " sẽ hết hạn trong 20 ngày tới");
            notifications.add(notification.getMessage());
        }

        notifier.notifyObservers(products);
        return notifications;
    }
}
