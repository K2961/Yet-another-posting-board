-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema K1533_2
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema K1533_2
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `K1533_2` DEFAULT CHARACTER SET utf8 ;
USE `K1533_2` ;

-- -----------------------------------------------------
-- Table `K1533_2`.`User`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `K1533_2`.`User` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(64) NOT NULL,
  `Password` VARCHAR(64) NOT NULL,
  `AvatarUrl` VARCHAR(255) NULL,
  `Joined` DATETIME NULL,
  PRIMARY KEY (`Id`),
  UNIQUE INDEX `Name_UNIQUE` (`Name` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `K1533_2`.`Forum`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `K1533_2`.`Forum` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Title` VARCHAR(64) NULL,
  `Created` DATETIME NULL,
  PRIMARY KEY (`Id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `K1533_2`.`Topic`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `K1533_2`.`Topic` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `UserId` INT NOT NULL,
  `ForumId` INT NOT NULL,
  `Title` VARCHAR(255) NULL,
  `Posted` DATETIME NULL,
  PRIMARY KEY (`Id`),
  INDEX `fk_Topic_User1_idx` (`UserId` ASC),
  INDEX `fk_Topic_Forum1_idx` (`ForumId` ASC),
  CONSTRAINT `fk_Topic_User1`
    FOREIGN KEY (`UserId`)
    REFERENCES `K1533_2`.`User` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Topic_Forum1`
    FOREIGN KEY (`ForumId`)
    REFERENCES `K1533_2`.`Forum` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `K1533_2`.`Message`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `K1533_2`.`Message` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `TopicId` INT NOT NULL,
  `UserId` INT NOT NULL,
  `Text` TEXT NULL,
  `Posted` DATETIME NULL,
  PRIMARY KEY (`Id`),
  INDEX `fk_Message_Topic_idx` (`TopicId` ASC),
  INDEX `fk_Message_User1_idx` (`UserId` ASC),
  CONSTRAINT `fk_Message_Topic`
    FOREIGN KEY (`TopicId`)
    REFERENCES `K1533_2`.`Topic` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Message_User1`
    FOREIGN KEY (`UserId`)
    REFERENCES `K1533_2`.`User` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `K1533_2`.`Moderator`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `K1533_2`.`Moderator` (
  `UserId` INT NOT NULL,
  `ForumId` INT NOT NULL,
  PRIMARY KEY (`UserId`, `ForumId`),
  INDEX `fk_User_has_Forum_Forum1_idx` (`ForumId` ASC),
  INDEX `fk_User_has_Forum_User1_idx` (`UserId` ASC),
  CONSTRAINT `fk_User_has_Forum_User1`
    FOREIGN KEY (`UserId`)
    REFERENCES `K1533_2`.`User` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_User_has_Forum_Forum1`
    FOREIGN KEY (`ForumId`)
    REFERENCES `K1533_2`.`Forum` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `K1533_2`.`Ban`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `K1533_2`.`Ban` (
  `Id` INT NULL AUTO_INCREMENT,
  `UserId` INT NOT NULL,
  `ForumId` INT NOT NULL,
  `Expires` DATETIME NOT NULL,
  PRIMARY KEY (`Id`),
  INDEX `fk_User_has_Forum_Forum2_idx` (`ForumId` ASC),
  INDEX `fk_User_has_Forum_User2_idx` (`UserId` ASC),
  CONSTRAINT `fk_User_has_Forum_User2`
    FOREIGN KEY (`UserId`)
    REFERENCES `K1533_2`.`User` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_User_has_Forum_Forum2`
    FOREIGN KEY (`ForumId`)
    REFERENCES `K1533_2`.`Forum` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
