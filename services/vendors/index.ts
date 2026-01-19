export * from './BaseVendorService';
export * from './AmazonBusinessService';
export * from './McMasterCarrService';
export * from './DigiKeyService';
export * from './CDWService';

import { BaseVendorService, VendorConfig } from './BaseVendorService';
import { AmazonBusinessService, createAmazonBusinessService } from './AmazonBusinessService';
import { McMasterCarrService, createMcMasterCarrService } from './McMasterCarrService';
import { DigiKeyService, createDigiKeyService } from './DigiKeyService';
import { CDWService, createCDWService } from './CDWService';
import { VendorType } from '../../models/PurchaseOrder';

/**
 * Vendor Service Factory
 * Creates and manages vendor service instances
 */
export class VendorServiceFactory {
  private static instances: Map<VendorType, BaseVendorService> = new Map();

  /**
   * Get or create a vendor service instance
   */
  static getService(vendorType: VendorType): BaseVendorService | null {
    // Check if we have a cached instance
    if (this.instances.has(vendorType)) {
      return this.instances.get(vendorType)!;
    }

    // Create new instance based on vendor type
    let service: BaseVendorService | null = null;

    switch (vendorType) {
      case 'amazon':
        service = createAmazonBusinessService();
        break;
      case 'mcmaster-carr':
        service = createMcMasterCarrService();
        break;
      case 'digikey':
        service = createDigiKeyService();
        break;
      case 'cdw':
        service = createCDWService();
        break;
      case 'other':
        // No service for "other" vendors
        return null;
    }

    if (service) {
      this.instances.set(vendorType, service);
    }

    return service;
  }

  /**
   * Get all available vendor services
   */
  static getAllServices(): Map<VendorType, BaseVendorService> {
    const vendorTypes: VendorType[] = ['amazon', 'mcmaster-carr', 'digikey', 'cdw'];

    for (const type of vendorTypes) {
      if (!this.instances.has(type)) {
        this.getService(type);
      }
    }

    return new Map(this.instances);
  }

  /**
   * Get vendor configuration status
   */
  static getVendorStatus(): {
    vendorType: VendorType;
    vendorName: string;
    isConfigured: boolean;
  }[] {
    const vendorTypes: VendorType[] = ['amazon', 'mcmaster-carr', 'digikey', 'cdw'];

    return vendorTypes.map(type => {
      const service = this.getService(type);
      return {
        vendorType: type,
        vendorName: service?.getVendorName() || type,
        isConfigured: service?.isConfigured() || false
      };
    });
  }

  /**
   * Clear cached instances (useful for testing)
   */
  static clearInstances(): void {
    this.instances.clear();
  }
}

/**
 * Helper function to get a vendor service by type
 */
export function getVendorService(vendorType: VendorType): BaseVendorService | null {
  return VendorServiceFactory.getService(vendorType);
}

/**
 * Helper function to get all vendor services
 */
export function getAllVendorServices(): Map<VendorType, BaseVendorService> {
  return VendorServiceFactory.getAllServices();
}

/**
 * Helper function to check vendor configuration status
 */
export function getVendorConfigurationStatus() {
  return VendorServiceFactory.getVendorStatus();
}

export default VendorServiceFactory;
