//
//  CustomPolygons.swift
//  heatmap
//
//  Created by Joe Anthony Peter Amanse on 3/9/18.
//  Copyright © 2018 Joe Anthony Peter Amanse. All rights reserved.
//

import Foundation
import MapKit

class HeatMapPolygon: MKPolygon {
    var identifier: String = ""
    var numberOfTriggers: Int?
}

class HeatMapCircle: MKCircle {
    var identifier: String = ""
}
