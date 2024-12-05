package com.rean.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.rean.model.Notification;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String>{

}
