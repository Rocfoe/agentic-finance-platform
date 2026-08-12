terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 7.0"
    }
  }
}

variable "project_id" {
  type        = string
  description = "Google Cloud project ID"
}

variable "network" {
  type        = string
  description = "Existing VPC network self-link or name"
}

variable "primary_region" {
  type        = string
  default     = "us-east1"
}

variable "secondary_region" {
  type        = string
  default     = "europe-west1"
}

provider "google" {
  project = var.project_id
  region  = var.primary_region
}

provider "google" {
  alias   = "eu"
  project = var.project_id
  region  = var.secondary_region
}

resource "google_alloydb_cluster" "primary" {
  cluster_id = "megacycle-alloydb-us-primary"
  location   = var.primary_region
  network    = var.network

  initial_user {
    user     = "megacycle_admin"
    password = var.initial_user_password
  }

  automated_backup_policy {
    enabled = true
    weekly_schedule {
      days_of_week = ["MONDAY"]
      start_times {
        hours = 2
      }
    }
  }
}

variable "initial_user_password" {
  type        = string
  sensitive   = true
  description = "Bootstrap password supplied securely at apply time"
}

resource "google_alloydb_instance" "primary" {
  cluster          = google_alloydb_cluster.primary.name
  instance_id      = "primary-instance-1"
  instance_type    = "PRIMARY"
  machine_cpu_count = 8
}

resource "google_alloydb_cluster" "secondary" {
  provider   = google.eu
  cluster_id = "megacycle-alloydb-eu-readpool"
  location   = var.secondary_region
  network    = var.network
  cluster_type = "SECONDARY"

  secondary_config {
    primary_cluster_name = google_alloydb_cluster.primary.name
  }
}

resource "google_alloydb_instance" "secondary" {
  provider          = google.eu
  cluster           = google_alloydb_cluster.secondary.name
  instance_id       = "secondary-read-instance-1"
  instance_type     = "READ_POOL"
  machine_cpu_count = 4
}

output "primary_cluster_name" {
  value = google_alloydb_cluster.primary.name
}

output "secondary_cluster_name" {
  value = google_alloydb_cluster.secondary.name
}
