import torch
from torchvision import datasets, transforms
from torch.utils.data import DataLoader, Subset
import numpy as np
from sklearn.model_selection import train_test_split


def get_dataloaders(
    dataset_path="Dataset",
    img_size=128,
    batch_size=32,
    num_workers=0
):
    # -------------------------
    # TRANSFORMS
    # -------------------------
    train_transform = transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.RandomHorizontalFlip(0.5),
        transforms.RandomRotation(15),
        transforms.ColorJitter(brightness=0.2, contrast=0.2),
        transforms.ToTensor(),
        transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5])
    ])

    val_transform = transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.ToTensor(),
        transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5])
    ])

    # -------------------------
    # DATASET
    # -------------------------
    base_dataset = datasets.ImageFolder(dataset_path)
    targets = base_dataset.targets
    class_names = base_dataset.classes

    train_idx, val_idx = train_test_split(
        np.arange(len(targets)),
        test_size=0.2,
        stratify=targets,
        random_state=42
    )

    train_dataset = Subset(
        datasets.ImageFolder(dataset_path, transform=train_transform),
        train_idx
    )

    val_dataset = Subset(
        datasets.ImageFolder(dataset_path, transform=val_transform),
        val_idx
    )

    # -------------------------
    # DATALOADERS
    # -------------------------
    train_loader = DataLoader(
        train_dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=num_workers
    )

    val_loader = DataLoader(
        val_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=num_workers
    )

    return train_loader, val_loader, class_names
