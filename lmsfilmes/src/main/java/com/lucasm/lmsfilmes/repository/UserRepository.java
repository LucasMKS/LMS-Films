package com.lucasm.lmsfilmes.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.lucasm.lmsfilmes.model.UserModel;

@Repository
public interface UserRepository extends JpaRepository<UserModel, Long> {
  Optional<UserModel> findByEmail(String email);
  Optional<UserModel> findById(Integer id);
  
  @SuppressWarnings("null")
  List<UserModel> findAll();
}
