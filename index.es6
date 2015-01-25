import * as IScroll from './node_modules/iscroll/build/iscroll-infinite.js'
import * as data from './data.json'
import * as eeTile from 'ee-tile'

export default function component(module) {
  eeTile.default(module)
  module.directive('experimentNgRepeat', directive('../ng-repeat.html'))
  module.directive('experimentNgRepeatTrackBy', directive('../ng-repeat-track-by.html'))
}

if ('angular' in global) {
  let app = angular.module('experiment', [])
  app.run(function($rootScope) {
    let items = data.default.map(function(item) {
      let opts = {}
      if (item.omChannel === "podcast") {
        opts.image = item.itunesImage
        opts.barText = item.title
        // opts.background = 'black'
        opts.bar = 'white'
        opts.fitText = false
        opts.ellipsis = false
      } else {
        opts.text = "Cupidatat sint aliquip eu dolore aute voluptate laborum aliquip ullamco fugiat commodo sunt. Et amet nulla eiusmod ut cupidatat excepteur non ut laborum."
        opts.barText = 'Placeholder bar text',
        opts.background = 'red'
        opts.bar = 'orange'
      }
      opts.id = item._id
      return opts
    })
    var rows = []
    for (var i = 0; i < items.length; i++) {
      var chunkIndex = parseInt(i / 2, 10)
      var isFirst = (i % 2 === 0)
      if (isFirst) {
        rows[chunkIndex] = [];
      }
      rows[chunkIndex].push(items[i])
    }
    $rootScope.items = rows
  })
  component(app)
}

function directive(templateUrl) {
  return function($timeout) {
    return {
      scope: {
        items: '='
      },
      restrict: 'E',
      controller: ctrl,
      controllerAs: 'ctrl',
      templateUrl: templateUrl,
      link: function(scope, element) {
        function requestData(start, count) {
          // do stuff to get the next data set
          console.log(start, count)
          var items = scope.items.slice(start, start+count)
          console.log(items)
          this.updateCache(start, items)
        }

        function updateContent (el, data) {
          // console.log(el, data)
          if (data === undefined) return
          var tiles = el.children
          // console.log(data[0])
          // console.log(data[1])
          $(tiles[0]).controller('eeTile').setOptions(data[0])
          $(tiles[1]).controller('eeTile').setOptions(data[1])
        }

        $timeout(function() {
          let scroller = new IScroll.default('#wrapper', {
            infiniteElements: '#scroller .row',
            infiniteLimit: scope.items.length,
            dataset: requestData,
            dataFiller: updateContent,
            cacheSize: 10
          })
        }, 1000)
      }
    }
  }
}

export function ctrl($scope) {
  this.items = $scope.items
}
