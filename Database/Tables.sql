-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Table `User`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `User` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(64) NULL,
  `Password` VARCHAR(64) NULL,
  `AvatarUrl` VARCHAR(255) NULL,
  `Joined` DATETIME NULL,
  PRIMARY KEY (`Id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Topic`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Topic` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `UserId` INT NOT NULL,
  `ParentId` INT NULL,
  `Title` VARCHAR(255) NULL,
  `Posted` DATETIME NULL,
  PRIMARY KEY (`Id`),
  INDEX `fk_Topic_Topic1_idx` (`ParentId` ASC),
  INDEX `fk_Topic_User1_idx` (`UserId` ASC),
  CONSTRAINT `fk_Topic_Topic1`
    FOREIGN KEY (`ParentId`)
    REFERENCES `Topic` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Topic_User1`
    FOREIGN KEY (`UserId`)
    REFERENCES `User` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Message`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Message` (
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
    REFERENCES `Topic` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Message_User1`
    FOREIGN KEY (`UserId`)
    REFERENCES `User` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
