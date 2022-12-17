import * as for_seller_landlord_component from "../for-seller-landlord.component"
import * as app_service_service from "../../../../../services/app-service.service"

// @ponicode
describe("for_seller_landlord_component.ForSellerLandlordComponent.getDescription", () => {
    let inst17: any
    let inst18: any
    let inst15: any
    let inst16: any
    let inst13: any
    let inst14: any
    let inst11: any
    let inst12: any
    let inst9: any
    let inst10: any
    let inst7: any
    let inst8: any
    let inst5: any
    let inst6: any
    let inst: any
    let inst4: any
    let inst2: any
    let inst3: any

    beforeEach(() => {
        inst17 = new app_service_service.AppServiceService()
        inst18 = new for_seller_landlord_component.ForSellerLandlordComponent(inst17)
        inst15 = new app_service_service.AppServiceService()
        inst16 = new for_seller_landlord_component.ForSellerLandlordComponent(inst15)
        inst13 = new app_service_service.AppServiceService()
        inst14 = new for_seller_landlord_component.ForSellerLandlordComponent(inst13)
        inst11 = new app_service_service.AppServiceService()
        inst12 = new for_seller_landlord_component.ForSellerLandlordComponent(inst11)
        inst9 = new app_service_service.AppServiceService()
        inst10 = new for_seller_landlord_component.ForSellerLandlordComponent(inst9)
        inst7 = new app_service_service.AppServiceService()
        inst8 = new for_seller_landlord_component.ForSellerLandlordComponent(inst7)
        inst5 = new app_service_service.AppServiceService()
        inst6 = new for_seller_landlord_component.ForSellerLandlordComponent(inst5)
        inst = new app_service_service.AppServiceService()
        inst4 = new for_seller_landlord_component.ForSellerLandlordComponent(inst)
        inst2 = new app_service_service.AppServiceService()
        inst3 = new for_seller_landlord_component.ForSellerLandlordComponent(inst2)
    })

    test("0", () => {
        let result: any = inst3.getDescription({ desc_en: "^5.0.0", desc_ar: true })
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = inst4.getDescription({ desc_en: "1.0.0", desc_ar: false })
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = inst6.getDescription({ desc_en: "4.0.0-beta1\t", desc_ar: true })
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = inst8.getDescription({ desc_en: "v1.2.4", desc_ar: true })
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = inst10.getDescription({ desc_en: "^5.0.0", desc_ar: false })
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let result: any = inst16.getDescription({ desc_en: "", desc_ar: false })
        expect(result).toMatchSnapshot()
    })
})
