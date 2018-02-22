ALTER TABLE AdminUsers
ADD COLUMN is2FAVerified bit default 0,
ADD COLUMN photo varchar(255),
ADD COLUMN status varchar(255); 			

ALTER TABLE CollectionHistories
ADD collection_id int(11),
ADD admin_user_id int(11),
ADD CONSTRAINT fk_collection_id FOREIGN KEY (collection_id) REFERENCES Collections(id),
ADD CONSTRAINT fk_admin_user_id FOREIGN KEY (admin_user_id) REFERENCES AdminUsers(id);


ALTER TABLE LoansHistories 
ADD loan_id int(11),
ADD admin_user_id int(11),
ADD CONSTRAINT fk_loan_id FOREIGN KEY (loan_id) REFERENCES Loans(id),
ADD CONSTRAINT fk_admin_user_id FOREIGN KEY (admin_user_id) REFERENCES AdminUsers(id);

ALTER TABLE Loans
ADD admin_user_id int(11),
ADD CONSTRAINT fk_admin_user_id FOREIGN KEY (admin_user_id) REFERENCES AdminUsers(id);

ALTER TABLE Users
ADD selfie_proof_video varchar(255);