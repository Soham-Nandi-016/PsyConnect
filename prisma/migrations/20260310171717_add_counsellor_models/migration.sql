-- CreateTable
CREATE TABLE `Counsellor` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `bio` TEXT NOT NULL,
    `specialty` ENUM('STRESS', 'ANXIETY', 'DEPRESSION', 'SLEEP', 'RELATIONSHIPS', 'ACADEMIC', 'GENERAL') NOT NULL DEFAULT 'GENERAL',
    `qualifications` TEXT NOT NULL,
    `philosophy` TEXT NOT NULL,
    `videoUrl` VARCHAR(191) NULL,
    `avatarUrl` VARCHAR(191) NULL,
    `rating` DOUBLE NOT NULL DEFAULT 5.0,
    `yearsExp` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TherapistAvailability` (
    `id` VARCHAR(191) NOT NULL,
    `counsellorId` VARCHAR(191) NOT NULL,
    `dayOfWeek` INTEGER NOT NULL,
    `startHour` INTEGER NOT NULL,
    `endHour` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Testimonial` (
    `id` VARCHAR(191) NOT NULL,
    `counsellorId` VARCHAR(191) NOT NULL,
    `studentName` VARCHAR(191) NOT NULL,
    `text` TEXT NOT NULL,
    `rating` INTEGER NOT NULL DEFAULT 5,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TherapyBooking` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `counsellorId` VARCHAR(191) NOT NULL,
    `appointmentTime` DATETIME(3) NOT NULL,
    `status` ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    `studentNotes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TherapistAvailability` ADD CONSTRAINT `TherapistAvailability_counsellorId_fkey` FOREIGN KEY (`counsellorId`) REFERENCES `Counsellor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Testimonial` ADD CONSTRAINT `Testimonial_counsellorId_fkey` FOREIGN KEY (`counsellorId`) REFERENCES `Counsellor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TherapyBooking` ADD CONSTRAINT `TherapyBooking_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TherapyBooking` ADD CONSTRAINT `TherapyBooking_counsellorId_fkey` FOREIGN KEY (`counsellorId`) REFERENCES `Counsellor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
